/* ------------------------------------------------------------------
* node-echonet-lite - lan
*
* Copyright (c) 2017-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-04-25
* ---------------------------------------------------------------- */
'use strict';
var mDgram = require('dgram');
var mOs = require('os');

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

	this._netif = null;
};

/* ------------------------------------------------------------------
* Method: init(callback)
* ---------------------------------------------------------------- */
EchonetLiteNetLan.prototype.init = function(params, callback) {
	if(params && params['netif']) {
		this._netif = params['netif'];
	}
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
		this._addMembership();
		callback(null);
	});
};

EchonetLiteNetLan.prototype._addMembership = function() {
	if(this._netif) {
		this.udp.addMembership(this.ENL_MULTICAST_ADDRESS, this._netif);
	} else {
		var netif_list = this._getNetIfList();
		netif_list.forEach((netif) => {
			this.udp.addMembership(this.ENL_MULTICAST_ADDRESS, netif);
		});
	}
};

EchonetLiteNetLan.prototype._dropMembership = function() {
	if(this._netif) {
		this.udp.dropMembership(this.ENL_MULTICAST_ADDRESS, this._netif);
	} else {
		var netif_list = this._getNetIfList();
		netif_list.forEach((netif) => {
			this.udp.dropMembership(this.ENL_MULTICAST_ADDRESS, netif);
		});
	}
};

EchonetLiteNetLan.prototype._getNetIfList = function() {
	let netifs = mOs.networkInterfaces();
	let list = [];
	for(let dev in netifs) {
		netifs[dev].forEach((info) => {
			if(info.family === 'IPv4' && info.internal === false) {
				let m = info.address.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
				if(m) {
					list.push(m[1]);
				}
			}
		});
	}
	return list;
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
	this._addMembership();
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
	this._dropMembership();
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