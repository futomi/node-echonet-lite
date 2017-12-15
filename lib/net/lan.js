/* ------------------------------------------------------------------
* node-echonet-lite - lan
*
* Copyright (c) 2017, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2017-12-15
* ---------------------------------------------------------------- */
'use strict';
var mDgram = require('dgram');

/* ------------------------------------------------------------------
* Constructor: EchonetLiteNetLan()
* ---------------------------------------------------------------- */
var EchonetLiteNetLan = function() {
	this.initialized = false;
	this.ENL_PORT = 3610;
	this.ENL_MULTICAST_ADDRESS = "224.0.23.0";
	this.udp = null;
	this.dataCallback = function(){};
	this.sentCallback = function(){};

	this._is_discovering = false;
	this._discovery_timer = null;
	this._discovery_multicast_try_num = 0;
	this._DISCOVERY_MULTICAST_TRY_MAX = 3;
	this._DISCOVERY_MULTICAST_INTERVAL = 1000;
};

/* ------------------------------------------------------------------
* Method: init(callback)
* ---------------------------------------------------------------- */
EchonetLiteNetLan.prototype.init = function(params, callback) {
	this.dataCallback = function() {};
	if(this.udp) {
		this.udp.close(() => {
			this.udp = null;
			this._prepare(callback);
		});
	} else {
		this._prepare(callback);
	}
};

EchonetLiteNetLan.prototype._prepare = function(callback) {
	if(typeof(callback) !== 'function') {
		callback = function() {};
	}
	this.initialized = true;
	this.udp = mDgram.createSocket('udp4');

	this.udp.once("error", (err) => {
		callback(err);
	});

	this.udp.on('message', (buf, device_info) => {
		this.dataCallback(buf, device_info);
	});

	this.udp.bind(this.ENL_PORT, () => {
		this.udp.addMembership(this.ENL_MULTICAST_ADDRESS);
		callback(null);
	});
};

/* ------------------------------------------------------------------
* Method: setDataCallback(callback)
* ---------------------------------------------------------------- */
EchonetLiteNetLan.prototype.setDataCallback = function(callback) {
	this.dataCallback = callback;
};

/* ------------------------------------------------------------------
* Method: setSentCallback(callback)
* ---------------------------------------------------------------- */
EchonetLiteNetLan.prototype.setSentCallback = function(callback) {
	this.sentCallback = callback;
};

/* ------------------------------------------------------------------
* Method: stopDiscovery()
* ---------------------------------------------------------------- */
EchonetLiteNetLan.prototype.stopDiscovery = function() {
	if(this._discovery_timer) {
		clearTimeout(this._discovery_timer);
		this._discovery_timer = null;
	}
	this._discovery_multicast_try_num = 0;
	this._is_discovering = false;
};

/* ------------------------------------------------------------------
* Method: startDiscovery(buf[, callback])
* ---------------------------------------------------------------- */
EchonetLiteNetLan.prototype.startDiscovery = function(buf, callback) {
	if(!callback) {
		callback = function() {};
	}
	this._is_discovering = true;
	var sendMulticast = () => {
		this.udp.send(buf, 0, buf.length, this.ENL_PORT, this.ENL_MULTICAST_ADDRESS, (err, bytes) => {
			this._discovery_multicast_try_num ++;
			if(err) {
				this.stopDiscovery();
			} else {
				this.sentCallback(buf, {'address': this.ENL_MULTICAST_ADDRESS});
				if(this._is_discovering === true && this._discovery_multicast_try_num < this._DISCOVERY_MULTICAST_TRY_MAX) {
					this._discovery_timer = setTimeout(() => {
						sendMulticast();
					}, this._DISCOVERY_MULTICAST_INTERVAL);
				}
			}
			callback(err, null);
		});
	};
	sendMulticast();
};

/* ------------------------------------------------------------------
* Method: send(address, buf[, callback])
* ---------------------------------------------------------------- */
EchonetLiteNetLan.prototype.send = function(address, buf, callback) {
	if(!callback) {
		callback = function(){};
	}
	this.udp.send(buf, 0, buf.length, this.ENL_PORT, address, (err, bytes) => {
		if(!err) {
			this.sentCallback(buf, {'address': address});
		}
		callback(err);
	});
};

/* ------------------------------------------------------------------
* Method: close([callback])
* ---------------------------------------------------------------- */
EchonetLiteNetLan.prototype.close = function(callback) {
	if(!callback) {
		callback = function(){};
	}
	this.initialized = false;
	this.dataCallback = function(){};
	this.sentCallback = function(){};
	if(this.udp) {
		this.udp.close(() => {
			this.udp = null;
			callback();
		});
	} else {
		this.udp = null;
		callback();
	}
};

module.exports = new EchonetLiteNetLan();