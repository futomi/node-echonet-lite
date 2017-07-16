/* ------------------------------------------------------------------
* node-echonet-lite - wisunb-bp35a1.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2017-07-16
* ---------------------------------------------------------------- */
'use strict';
var mSerialPort = require('serialport');

/* ------------------------------------------------------------------
* Constructor: EchonetLiteNetWisunb()
* ---------------------------------------------------------------- */
var EchonetLiteNetWisunb = function() {
	this.ENL_PORT = 3610;
	this.BAUD = 115200;
	this.SERIAL_SEND_INTERVAL = 500; // ms

	this.initialized = false;
	this.dataCallback = function(){};
	this.sentCallback = function(){};
	this.dataCallbackSerial = function(){};
	this.sentCallbackSerial = function(){};

	this.serialCallback = function(){};
	this.params = {};
	this.port = null;
	this.device = null;
	this.is_discovering = false;
	this.discovery_timer_id = null;
	this.response_buffer = null;
	this.response_text = '';

	this.mAdapter = null;
};

/* ------------------------------------------------------------------
* Method: init(params, callback)
* - params:
*     adapter: required: The name of the Wi-SUN USB Adapter
*     path   : required : Path of the serial port (e.x. 'COM3')
*     id     : required : Route-B ID,
*     pass   : required : Route-B Password,
*     baud   : optional : Baud rate of the serial port
* ---------------------------------------------------------------- */
EchonetLiteNetWisunb.prototype.init = function(params, callback) {
	var adapter = params['adapter'];
	if(!adapter) {
		throw new Error('The value of the "adapter" property is required.');
	} else if(typeof(adapter) !== 'string') {
		throw new Error('The value of the "adapter" property must be string.');
	} else if(!adapter.match(/^(bp35a1|rl7023)$/)) {
		throw new Error('The value of the "adapter" property must be "bp35a1" or "rl7023".');
	}

	var path = params['path'];
	if(!path) {
		throw new Error('The value of the "path" property is required.');
	} else if(typeof(path) !== 'string') {
		throw new Error('The value of the "path" property must be string.');
	}

	var id = params['id'];
	if(!id) {
		throw new Error('The value of the "id" property is required.');
	} else if(typeof(id) !== 'string') {
		throw new Error('The value of the "id" property must be string.');
	}

	var pass = params['pass'];
	if(!pass) {
		throw new Error('The value of the "pass" property is required.');
	} else if(typeof(pass) !== 'string') {
		throw new Error('The value of the "pass" property must be string.');
	}

	var baud = params['baud'];
	if(baud) {
		if(typeof(baud) !== 'number' || baud % 1 !== 0) {
			throw new Error('The value of the "baud" property is invalid.');
		}
	} else {
		baud = this.BAUD;
	}

	this.params = {
		'adapter': adapter,
		'path'   : path,
		'id'     : id,
		'pass'   : pass,
		'baud'   : baud
	};

	this.mAdapter = require('./wisunb-' + adapter + '.js');

	this.dataCallback = function() {};
	this.serialCallback = function() {};
	if(this.port) {
		this.port.close(() => {
			this.port = null;
			this._prepare(callback);
		});
	} else {
		this._prepare(callback);
	}
};

EchonetLiteNetWisunb.prototype._prepare = function(callback) {
	if(typeof(callback) !== 'function') {
		callback = function() {};
	}

	this.port = new mSerialPort(this.params['path'], {
		baudRate: this.params['baud']
	});

	this.port.on('error', (err) => {
		callback(err);
	});

	this.port.once('open', () => {
		this.initialized = true;
		this._disableEchoback(callback);
	});

	this.port.on('data', (buf) => {
		this.response_text += buf.toString('utf8');
		if(this.response_buffer === null) {
			this.response_buffer = buf;
		} else {
			this.response_buffer = Buffer.concat([this.response_buffer, buf]);
		}
		if(this.response_text.match(/\r\n$/)) {
			this.dataCallbackSerial(this.response_buffer);
			this.serialCallback(this.response_text, this.response_buffer);
			this.response_text = '';
			this.response_buffer = null;
		}

	});
};

// Turn off echoback
EchonetLiteNetWisunb.prototype._disableEchoback = function(callback) {
	this._setSerialCallback((res) => {
		if(this._isResponseOk(res)) {
			setTimeout(() => {
				this._setBroutePass(callback);
			}, this.SERIAL_SEND_INTERVAL);
		} else {
			showErrorExit('Failed to turn off echoback.');
		}
	});
	var cmd = 'SKSREG SFE 0';
	this._sendCommand(cmd, (err) => {
		callback(err);
	});
}

// Set the Route-B password
EchonetLiteNetWisunb.prototype._setBroutePass = function(callback) {
	this._setSerialCallback((res) => {
		if(this._isResponseOk(res)) {
			setTimeout(() => {
				this._setBrouteId(callback);
			}, this.SERIAL_SEND_INTERVAL);
		} else {
			var err = new Error('Failed to set the Route-B password: ' + res);
			callback(err);
		}
	});
	var pass = this.params['pass'];
	var len = pass.length.toString(16);
	var cmd = ['SKSETPWD', len, pass].join(' ');
	this._sendCommand(cmd, (err) => {
		callback(err);
	});
};

// Set the Rout-B ID
EchonetLiteNetWisunb.prototype._setBrouteId = function(callback) {
	this._setSerialCallback((res) => {
		if(this._isResponseOk(res)) {
			setTimeout(() => {
				callback();
			}, this.SERIAL_SEND_INTERVAL);
		} else {
			var err = new Error('Failed to set the Route-B ID: ' + res);
			callback(err);
		}
	});
	var cmd = 'SKSETRBID ' + this.params['id'];
	this._sendCommand(cmd, (err) => {
		callback(err);
	});
};

EchonetLiteNetWisunb.prototype._sendCommand = function(cmd, callback) {
	var buf = new Buffer(cmd + '\r\n', 'utf8');
	this.port.write(buf, (err) => {
		if(err) {
			callback(err);
		} else {
			this.sentCallbackSerial(buf, this.device);
		}
	});
};

EchonetLiteNetWisunb.prototype._isResponseOk = function(res) {
	var is_ok = false;
	res.split('\r\n').forEach((ln) => {
		if(ln === 'OK') {
			is_ok = true;
		}
	});
	return is_ok;
};

EchonetLiteNetWisunb.prototype._getFailLine = function(res) {
	var m = res.match(/(FAIL[^\r]+)/);
	return m ? m[1] : '';

};

EchonetLiteNetWisunb.prototype._setSerialCallback = function(callback) {
	this.serialCallback = callback;
};

/* ------------------------------------------------------------------
* Method: setDataCallback(callback)
* ---------------------------------------------------------------- */
EchonetLiteNetWisunb.prototype.setDataCallback = function(callback) {
	this.dataCallback = callback;
};

/* ------------------------------------------------------------------
* Method: setSentCallback(callback)
* ---------------------------------------------------------------- */
EchonetLiteNetWisunb.prototype.setSentCallback = function(callback) {
	this.sentCallback = callback;
};

/* ------------------------------------------------------------------
* Method: setDataCallbackSerial(callback)
* ---------------------------------------------------------------- */
EchonetLiteNetWisunb.prototype.setDataCallbackSerial = function(callback) {
	this.dataCallbackSerial = callback;
};

/* ------------------------------------------------------------------
* Method: setSentCallbackSerial(callback)
* ---------------------------------------------------------------- */
EchonetLiteNetWisunb.prototype.setSentCallbackSerial = function(callback) {
	this.sentCallbackSerial = callback;
};

/* ------------------------------------------------------------------
* Method: stopDiscovery()
* ---------------------------------------------------------------- */
EchonetLiteNetWisunb.prototype.stopDiscovery = function() {
	if(this.is_discovering === true) {
		this.setDataCallback(function(){});
		if(this.discovery_timer_id) {
			clearTimeout(this.discovery_timer_id);
			this.discovery_timer_id = null;
		}
		this.device = null;
		this.is_discovering = false;
	}
};

/* ------------------------------------------------------------------
* Method: startDiscovery(buf[, callback])
* ---------------------------------------------------------------- */
EchonetLiteNetWisunb.prototype.startDiscovery = function(buf, callback) {
	if(!callback) {
		callback = function() {};
	}
	this.is_discovering = true;
	this._activeScan((err) => {
		if(err) {
			callback(err);
		} else {
			this._setDataReceiveCallback();
			setTimeout(() => {
				this.send(this.device['address'], buf, (err) => {
					if(err) {
						callback(err);
					}
				});
			}, 500);
		}
	});
};

// Start the active scan
EchonetLiteNetWisunb.prototype._activeScan = function(callback) {
	this._setSerialCallback((res) => {
		if(res.match(/(^|\r\n)FAIL/)) {
			var msg = 'Failed the active scan: ' + this._getFailLine(res);
			var err = new Error(msg);
			callback(err);
		} else if(res.match(/(^|\r\n)EVENT 20/)) {
			this.device = {};
			res.split('\r\n').forEach((ln) => {
				var m = ln.match(/^\s+([^\:]+)\:(.+)/);
				if(m) {
					this.device[m[1]] = m[2];
				}
			});
		} else if(res.match(/(^|\r\n)EVENT 22/)) {
			this.discovery_timer_id = null;
			if(this.device) {
				this.is_discovering = false;
				setTimeout(() => {
					this._setChannel(callback);
				}, this.SERIAL_SEND_INTERVAL);
			} else {
				this.discovery_timer_id = setTimeout(() => {
					this.startDiscovery(callback);
				}, this.SERIAL_SEND_INTERVAL);
			}
		}
	});
	//var cmd = 'SKSCAN 2 FFFFFFFF 6';
	var cmd = this.mAdapter.createTextSKSCAN();
	this._sendCommand(cmd, (err) => {
		callback(err);
	});
};

// Set the logical channel number
EchonetLiteNetWisunb.prototype._setChannel = function(callback) {
	this._setSerialCallback((res) => {
		if(this._isResponseOk(res)) {
			setTimeout(() => {
				this._setPanId(callback);
			}, this.SERIAL_SEND_INTERVAL);
		} else {
			var msg = 'Failed to set the logical channel number: ' + this._getFailLine(res);
			var err = new Error(msg);
			callback(err);
		}
	});
	var cmd = 'SKSREG S2 ' + this.device['Channel'];
	this._sendCommand(cmd, (err) => {
		callback(err);
	});
};

// Set the PAN ID to the virtual register
EchonetLiteNetWisunb.prototype._setPanId = function(callback) {
	this._setSerialCallback((res) => {
		if(this._isResponseOk(res)) {
			setTimeout(() => {
				this._convertMACtoIPV6(callback);
			}, this.SERIAL_SEND_INTERVAL);
		} else {
			var msg = 'Failed to set the PAN ID to the virtual register: ' + this._getFailLine(res);
			var err = new Error(msg);
			callback(err);
		}
	});
	var cmd = 'SKSREG S3 ' + this.device['Pan ID'];
	this._sendCommand(cmd, (err) => {
		callback(err);
	});
};

// Convert a 64 bit Mac address to a IPv6 link local address
EchonetLiteNetWisunb.prototype._convertMACtoIPV6 = function(callback) {
	this._setSerialCallback((res) => {
		var m = res.match(/(^|\r\n)([A-Fa-f0-9\:]+)/);
		if(m) {
			this.device['address'] = m[2];
			setTimeout(() => {
				this._joinPana(callback);
			}, this.SERIAL_SEND_INTERVAL);
		} else {
			var msg = 'Failed to convert the MAC address to a IPv6 address:' + this._getFailLine(res);
			var err = new Error(msg);
			callback(err);
		}
	});
	var cmd = 'SKLL64 ' + this.device['Addr'];
	this._sendCommand(cmd, (err) => {
		callback(err);
	});
};

// Join to the PANA
EchonetLiteNetWisunb.prototype._joinPana = function(callback) {
	this._setSerialCallback((res) => {
		if(res.match(/(^|\r\n)FAIL/)) {
			var msg = 'Failed to join the PANA: ' + this._getFailLine(res);
			var err = new Error(msg);
			callback(err);	
		} else if(res.match(/(^|\r\n)EVENT 25/)) {
			callback(null);
		} else if(res.match(/(^|\r\n)EVENT 24/)) {
			var err = new Error('Failed to join the PANA');
			callback(err);
		}
	});
	var cmd = 'SKJOIN ' + this.device['address'];
	this._sendCommand(cmd, (err) => {
		callback(err);
	});
};

EchonetLiteNetWisunb.prototype._setDataReceiveCallback = function() {
	this._setSerialCallback((res_text, res_buf) => {
		if(res_text.match(/(^|\r\n)ERXUDP /)) {
			var el_buf = this.mAdapter.getELBufferFromResponse(res_text, res_buf);
			if(el_buf) {
				this.dataCallback(el_buf, this.device);
			}
		}
	});
};

/* ------------------------------------------------------------------
* Method: send(address, buf[, callback])
* ---------------------------------------------------------------- */
EchonetLiteNetWisunb.prototype.send = function(address, buf, callback) {
	if(!callback) {
		callback = function(){};
	}
	var serial_buf = this.mAdapter.createBufferSKSENDTO(address, buf);
	this.port.write(serial_buf, (err) => {
		if(!err) {
			this.sentCallbackSerial(serial_buf, this.device);
			this.sentCallback(buf, this.device);
		}
		callback(err);
	});
};

/* ------------------------------------------------------------------
* Method: close([callback])
* ---------------------------------------------------------------- */
EchonetLiteNetWisunb.prototype.close = function(callback) {
	if(!callback) {
		callback = function(){};
	}
	this.initialized = false;
	this.dataCallback = function(){};
	this.sentCallback = function(){};
	this.dataCallbackSerial = function(){};
	this.sentCallbackSerial = function(){};

	this.serialCallback = function(){};
	this.params = {};
	this.device = null;
	this.is_discovering = false;
	this.discovery_timer_id = null;
	this.response_buffer = null;
	this.response_text = '';

	this.mAdapter = null;

	if(this.port) {
		this.port.close(() => {
			this.port = null;
			callback();
		});
	} else {
		this.port = null;
		callback();
	}
};

module.exports = new EchonetLiteNetWisunb();
