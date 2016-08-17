/* ------------------------------------------------------------------
* node-echonet-lite - FF-00-84.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-02
*
* - Class group code : FF : Super Class Group
* - Class code       : 00 : Device Object Super Class
* - EPC              : 84 : Measured instantaneous power consumption
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'IPC': {
				'field': 'Instantaneous power consumption',
				'values': {}
			}
		},
		'ja': {
			'IPC': {
				'field': '瞬時消費電力',
				'values': {}
			}
		},
	}
	this.desc = this.descs[this.lang];
};

EchonetLitePropertyParser.prototype.setLang = function(lang) {
	if(this.descs[lang]) {
		this.desc = this.descs[lang];
		this.lang = lang;
	}
	return this.lang;
};

EchonetLitePropertyParser.prototype.parse = function(buf) {
	var structure = [];
	// Check the length of the buffer
	if(buf.length !== 2) {
		return null;
	}
	// Instantaneous power consumption
	var ipc_buf = buf.slice(0, 2);
	var ipc_key = 'IPC';
	var ipc_value = ipc_buf.readUInt16BE(0);
	var ipc_desc = ipc_value.toString() + ' W';
	var ipc = {
		'key'   : ipc_key,
		'field' : this.desc[ipc_key]['field'],
		'value' : ipc_value,
		'buffer': ipc_buf,
		'hex'   : mBuffer.convBufferToHexString(ipc_buf),
		'desc'  : ipc_desc
	};
	structure.push(ipc);

	var parsed = {
		'message': {
			'power': ipc_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var power = data['power'];
	if(typeof(power) !== 'number' || power < 0 || power > 65533) {
		throw new Error('The "power" property in the 1st argument "data" is invalid.');
	}

	var power_buf = new Buffer(2);
	power_buf.writeUInt16BE(power);
	return power_buf;
};

module.exports = new EchonetLitePropertyParser();
