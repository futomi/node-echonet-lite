/* ------------------------------------------------------------------
* node-echonet-lite - node-echonet-lite.js
*
* Copyright (c) 2017-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-04-25
* ---------------------------------------------------------------- */
'use strict';
var mEventEmitter = require('events').EventEmitter;
var mUtil         = require('util');
var mELCore       = require('./core/core.js');

/* ------------------------------------------------------------------
* Constructor: EchonetLite(params)
* - params:
*   - lang    | String | Optional | Language code, 'en' (default) or 'ja'.
*   - type    | String | Required | Network type code, 'lan' or 'wisunb'.
*
*   [When the `type` is `lan`]
*   - netif   | String | Optional | Multicast interface.(e.g., "192.168.1.5")
*
*   [When the `type` is `wisunb`]
*   - adapter | String | Required | Product name of Wi-SUN USB dongle, 'bp35a1', or 'rl7023'.
*   - path    | String | Required | Path of the serial port (e.g.'COM3').
*   - id      | String | Required | Route-B ID.
*   - pass    | String | Required | Route-B Password.
*   - baud    | Number | Optional | Baud rate of the serial port. The default vlaue is 115200.
* ---------------------------------------------------------------- */
var EchonetLite = function(params) {
	this.lang = 'en';
	if(('lang' in params) && typeof(params['lang'] === 'string') && params['lang'] !== '') {
		var lang = params['lang'].toLowerCase();
		if(lang.match(/^(en|ja)$/)) {
			this.lang = lang;
		} else {
			throw new Error('The value of the "lang" property must be "en" or "ja".');
		}
	}
	this.lang = mELCore.setLang(lang);

	this.type = 'lan';
	if(('type' in params) && typeof(params['type'] === 'string') && params['type'] !== '') {
		var type = params['type'].toLowerCase();
		if(type.match(/^(lan|wisunb)$/)) {
			this.type = type;
		} else {
			throw new Error('The value of the "type" property must be "lan" or "wisunb".');
		}
	}

	this.netif = '';
	this.adapter = '';
	this.path = '';
	this.id   = '';
	this.pass = '';
	this.baud = 0;
	if(this.type === 'lan') {
		// netif
		if('netif' in params) {
			var netif = params['netif'];
			if(typeof(netif) === 'string') {
				if(netif !== '') {
					if(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(netif)) {
						this.netif = netif;
					} else {
						throw new Error('The value of the "netif" property must be an IPv4 address.');
					}
				}
			} else {
				throw new Error('The value of the "netif" property must be a non-empty string.');
			}
		}
	} else if(this.type === 'wisunb') {
		// adapter
		if(('adapter' in params) && typeof(params['adapter'] === 'string') && params['adapter'] !== '') {
			var adapter = params['adapter'].toLowerCase();
			if(adapter.match(/^(bp35c2|bp35a1|rl7023)$/i)) {
				this.adapter = adapter.toLowerCase();
			} else {
				throw new Error('The value of the "adapter" property must be "bp35c2" or "bp35a1" or "rl7023".');
			}
		} else {
			throw new Error('The "adapter" property is required.');
		}

		// path
		if(('path' in params) && typeof(params['path'] === 'string') && params['path'] !== '') {
			this.path = params['path'];
		} else {
			throw new Error('The "path" property is required.');
		}

		// id
		if(('id' in params) && typeof(params['id'] === 'string') && params['id'] !== '') {
			this.id = params['id'];
		} else {
			throw new Error('The "id" property is required.');
		}

		// pass
		if(('pass' in params) && typeof(params['pass'] === 'string') && params['pass'] !== '') {
			this.pass = params['pass'];
		} else {
			throw new Error('The "pass" property is required.');
		}

		// baud
		if(('baud' in params) && typeof(params['baud'] === 'string') && params['baud'] !== '') {
			this.baud = params['baud'];
		}
	}

	this.initialized = false;
	this.callbacks = {};
	this.last_transaction_id = 0;
	this.discovery_tid = 0;

	this.discovery_seoj = [0x05, 0xFF, 0x01]; // Management/control-related device class group, Controller class
	this.discovery_deoj = [0x0E, 0xF0, 0x00]; // Profile class group, Node profile class
	this.discovery_esv = 'Get';
	this.discovery_prop = [{'epc': 0xD6, 'edt': null}] // Self-node instance list S

	this.self_eoj = null;

	this.mELNet = null;
	if(this.type === 'lan') {
		this.mELNet = require('./net/lan.js');
	} else if(this.type === 'wisunb') {
		this.mELNet = require('./net/wisunb.js');
	}

	mEventEmitter.call(this);
};
mUtil.inherits(EchonetLite, mEventEmitter);

/* ------------------------------------------------------------------
* Method: setLang(lang)
* ---------------------------------------------------------------- */
EchonetLite.prototype.setLang = function(lang) {
	this.lang = mELCore.setLang(lang);
	return this.lang;
};

/* ------------------------------------------------------------------
* Method: getClassGroupName(group_code)
* ---------------------------------------------------------------- */
EchonetLite.prototype.getClassGroupName = function(group_code) {
	return mELCore.getClassGroupName(group_code);
};

/* ------------------------------------------------------------------
* Method: getClassName(group_code, class_code)
* ---------------------------------------------------------------- */
EchonetLite.prototype.getClassName = function(group_code, class_code) {
	return mELCore.getClassName(group_code, class_code);
};

/* ------------------------------------------------------------------
* Method: getPropertyName(group_code, class_code, epc)
* ---------------------------------------------------------------- */
EchonetLite.prototype.getPropertyName = function(group_code, class_code, epc) {
	return mELCore.getPropertyName(group_code, class_code, epc);
};

/* ------------------------------------------------------------------
* Method: isSupportedEpc(group_code, class_code, epc);
* ---------------------------------------------------------------- */
EchonetLite.prototype.isSupportedEpc = function(group_code, class_code, epc) {
	return mELCore.isSupportedEpc(group_code, class_code, epc);
};

/* ------------------------------------------------------------------
* Method: setSelfEoj(group_code, class_code, instance_code);
* ---------------------------------------------------------------- */
EchonetLite.prototype.setSelfEoj = function(eoj) {
	if(!eoj || !Array.isArray(eoj) || eoj.length !== 3) {
		throw new Error('The 1st argument is invalid as an EOJ.');
	}
	for(var i=0; i<3; i++) {
		var v = eoj[i];
		if(typeof(v) !== 'number' || v < 0 || v > 255 || v % 1 !== 0) {
			throw new Error('The 1st argument is invalid as an EOJ.');
		}
	}
	this.self_eoj = JSON.parse(JSON.stringify(eoj));
};

/* ------------------------------------------------------------------
* Method: init(callback)
* ---------------------------------------------------------------- */
EchonetLite.prototype.init = function(callback) {
	if(typeof(callback) !== 'function') {
		callback = function() {};
	}
	this.initialized = false;
	this.callbacks = {};
	this.last_transaction_id = 0;
	this.discovery_tid = 0;

	//this.setLang(this.lang);

	var params = {
		'netif'   : this.netif,
		'adapter' : this.adapter,
		'path'    : this.path,
		'id'      : this.id,
		'pass'    : this.pass,
		'baud'    : this.baud
	};
	this.mELNet.init(params, (err) => {
		this.initialized = err ? true : false;
		if(err) {
			callback(err);
		} else {
			this._prepare();
			callback(null);
		}
	});
};

EchonetLite.prototype._prepare = function() {
	this.mELNet.setDataCallback((buf, device) => {
		if(!buf) { return; }
		var parsed = mELCore.parse(buf);
		if(!parsed) { return; }
		parsed['device'] = device;
		var tid = parsed['message']['tid'];
		var executed = this._execCallback(tid, null, parsed);
		if(executed === false) {
			this.emit('notify', parsed);
		}
		this.emit('data', parsed);
	});

	this.mELNet.setSentCallback((buf, device) => {
		if(!buf) { return; }
		var parsed = mELCore.parse(buf);
		if(!parsed) { return; }
		parsed['device'] = device;
		this.emit('sent', parsed);
	});

	if(this.type === 'wisunb') {
		this.mELNet.setDataCallbackSerial((buf, device) => {
			if(!buf) { return; }
			var data = this._stringifySerialBuffer(buf);
			var parsed = {
				'device': device,
				'data'  : data
			};
			this.emit('data-serial', parsed);
		});
		this.mELNet.setSentCallbackSerial((buf, device) => {
			if(!buf) { return; }
			var data = this._stringifySerialBuffer(buf);
			var parsed = {
				'device': device,
				'data'  : data
			};
			this.emit('sent-serial', parsed);
		});
	}
};

EchonetLite.prototype._stringifySerialBuffer = function(buf) {
	var bin_mode = false;
	var res = '';

	var buf_len = buf.length;
	var crlf = false;
	if(buf.readUInt16BE(buf_len-2) === 0x0D0A) {
		buf = buf.slice(0, buf_len-2);
		crlf = true;
	}
	for (var c of buf.values()) {
		if(!bin_mode && !((c >= 0x20 && c <= 0x7E) || c === 0x0A || c === 0x0D)) {
			bin_mode = true;
		}
		if(bin_mode === true) {
			res += ('0' + c.toString(16)).slice(-2).toUpperCase();
		} else {
			res += String.fromCharCode(c);
		}
	}
	if(crlf) {
		res += '\r\n';
	}
	return res;
};

EchonetLite.prototype._getNewTransactionId = function() {
	var tid = (this.last_transaction_id + 1) % 0xFFFF || 1;
	this.last_transaction_id = tid;
	return tid;
};

EchonetLite.prototype._addCallback = function(callback, once) {
	var tid = this._getNewTransactionId();
	this.callbacks[tid] = {
		'once': once,
		'callback': callback
	};
	return tid;
};

EchonetLite.prototype._delCallback = function(tid) {
	if(tid in this.callbacks) {
		delete this.callbacks[tid];
	}
};

EchonetLite.prototype._execCallback = function(tid, err, res) {
	if(this.callbacks[tid]) {
		this.callbacks[tid]['callback'](err, res);
		if(this.callbacks[tid] && this.callbacks[tid]['once'] === true) {
			this._delCallback(tid);
		}
		return true;
	} else {
		return false;
	}
};

/* ------------------------------------------------------------------
* Method: stopDiscovery()
* ---------------------------------------------------------------- */
EchonetLite.prototype.stopDiscovery = function() {
	if(this.discovery_tid > 0) {
		this._delCallback(this.discovery_tid);
		this.discovery_tid = 0;
		this.mELNet.stopDiscovery();
	}
};

/* ------------------------------------------------------------------
* Method: startDiscovery([callback])
* ---------------------------------------------------------------- */
EchonetLite.prototype.startDiscovery = function(callback) {
	if(!callback) {
		callback = function() {};
	}
	if(this.initialized === false) {
		this.init((err) => {
			if(err) {
				callback(err, null);
			} else {
				this._prepareDiscovery(callback);
			}
		});
	} else {
		this._prepareDiscovery(callback);
	}
};

EchonetLite.prototype._prepareDiscovery = function(callback) {
	this._discovered_devices = {};
	var self_eoj = this.self_eoj ? this.self_eoj : this.discovery_seoj;
	var tid = this._addCallback((err, parsed) => {
		var ip = parsed['device']['address'];
		if(ip in this._discovered_devices) {
			return;
		} else {
			this._discovered_devices[ip] = true;
		}
		var seoj = parsed['message']['seoj'];
		var deoj = parsed['message']['deoj'];
		var prop = parsed['message']['prop'];
		var is_my_packet_echo = (
			seoj[0] === self_eoj[0] &&
			seoj[1] === self_eoj[1] &&
			seoj[2] === self_eoj[2] &&
			deoj[0] === this.discovery_deoj[0] &&
			deoj[1] === this.discovery_deoj[1] &&
			deoj[2] === this.discovery_deoj[2] &&
			prop.length === 1 &&
			prop[0]['epc'] === this.discovery_prop[0]['epc']
		);
		if(!is_my_packet_echo) {
			var eoj_list = [];
			try {
				var list = parsed['message']['prop'][0]['edt']['list'];
				list.forEach((eoj) => {
					eoj_list.push(eoj);
				});
			} catch(e) {

			}
			parsed['device']['eoj'] = eoj_list;
			callback(err, parsed);
		}
	}, false);

	var buf = mELCore.create({
		'tid' : tid,
		'seoj': self_eoj,
		'deoj': this.discovery_deoj,
		'esv' : this.discovery_esv,
		'prop': this.discovery_prop
	});
	this.mELNet.startDiscovery(buf, (err) => {
		if(err) {
			callback(err, null);
		}
	});

	this.discovery_tid = tid;
};

/* ------------------------------------------------------------------
* Method: send(address, eoj, esv, prop[, callback])
* ---------------------------------------------------------------- */
EchonetLite.prototype.send = function(address, eoj, esv, prop, callback) {
	if(!callback) {
		callback = function(){};
	}
	var data = {
		'seoj': this.self_eoj ? this.self_eoj : this.discovery_seoj,
		'deoj': eoj,
		'prop': prop,
		'tid': this._addCallback(callback, true),
		'esv': esv
	};
	var buf = mELCore.create(data);
	this.mELNet.send(address, buf, (err) => {
		if(err) {
			callback(err);
		} else {
			var parsed = mELCore.parse(buf);
			parsed['device'] = {
				'address': address
			}
		}
	});
};

/* ------------------------------------------------------------------
* Method: getPropertyMaps(address, eoj[, callback])
* - Retuen value: TID
* ---------------------------------------------------------------- */
EchonetLite.prototype.getPropertyMaps = function(address, eoj, callback) {
	if(!callback) {
		callback = function(){};
	}
	var prop = [
		{'epc': 0x9D, 'edt': null}, // Status change announcement property map
		{'epc': 0x9E, 'edt': null}, // Set property map
		{'epc': 0x9F, 'edt': null}  // Get property map
	];
	var tid = this.send(address, eoj, 'Get', prop, (err, res) => {
		if(err) {
			callback(err, null);
		} else {
			var maps = {};
			res['message']['prop'].forEach((o) => {
				var epc = o['epc'];
				var k = '';
				if(epc === 0x9D) {
					k = 'inf';
				} else if(epc === 0x9E) {
					k = 'set';
				} else if(epc === 0x9F) {
					k = 'get';
				}
				if(k) {
					maps[k] = o['edt']['list'];
				}
			});
			['inf', 'set', 'get'].forEach((k) => {
				if(!(k in maps) || !Array.isArray(maps[k])) {
					maps[k] = [];
				}
			});
			res['message']['data'] = maps;
			callback(null, res);
		}
	});
	return tid;
};

/* ------------------------------------------------------------------
* Method: getPropertyValue(address, eoj, epc[, callback])
* - Retuen value: TID
* ---------------------------------------------------------------- */
EchonetLite.prototype.getPropertyValue = function(address, eoj, epc, callback) {
	if(!callback) {
		callback = function(){};
	}
	var prop = [
		{'epc': epc, 'edt': null}
	];
	var tid = this.send(address, eoj, 'Get', prop, (err, res) => {
		if(err) {
			callback(err, null);
		} else {
			var value = null;
			res['message']['prop'].forEach((o) => {
				if(o['epc'] === epc) {
					value = o['edt'];
				}
			});
			res['message']['data'] = value;
			callback(null, res);
		}
	});
	return tid;
};

/* ------------------------------------------------------------------
* Method: setPropertyValue(address, eoj, epc, edt[, callback])
* - Retuen value: TID
* ---------------------------------------------------------------- */
EchonetLite.prototype.setPropertyValue = function(address, eoj, epc, edt, callback) {
	if(!callback) {
		callback = function(){};
	}
	var prop = [
		{'epc': epc, 'edt': edt}
	];
	var tid = this.send(address, eoj, 'SetC', prop, (err, res) => {
		if(err) {
			callback(err, null);
		} else {
			var value = null;
			res['message']['prop'].forEach((o) => {
				if(o['epc'] === epc) {
					value = o['edt'];
				}
			});
			res['message']['data'] = value;
			callback(null, res);
		}
	});
	return tid;
};

/* ------------------------------------------------------------------
* Method: close([callback])
* ---------------------------------------------------------------- */
EchonetLite.prototype.close = function(callback) {
	if(!callback) {
		callback = function(){};
	}
	this.lang = 'en';
	this.type = 'lan';
	this.adapter = '';
	this.path = '';
	this.id   = '';
	this.pass = '';
	this.baud = 0;
	this.initialized = false;
	this.callbacks = {};
	this.last_transaction_id = 0;
	this.discovery_tid = 0;
	this.mELNet.close(() => {
		this.mELNet = null;
		callback();
	});
};

module.exports = EchonetLite;