/* ------------------------------------------------------------------
* node-echonet-lite - FF-00-85.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : FF : Super Class Group
* - Class code       : 00 : Device Object Super Class
* - EPC              : 85 : Measured cumulative power consumption
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'CPC': {
				'field': 'Cumulative power consumption',
				'values': {}
			}
		},
		'ja': {
			'CPC': {
				'field': '積算消費電力',
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
	if(buf.length !== 4) {
		return null;
	}
	// Instantaneous power consumption
	var cpc_buf = buf.slice(0, 4);
	var cpc_key = 'CPC';
	var cpc_value = cpc_buf.readUInt32BE(0);
	var cpc_desc = (cpc_value / 1000).toString() + ' kWh';
	var cpc = {
		'key'   : cpc_key,
		'field' : this.desc[cpc_key]['field'],
		'value' : cpc_value,
		'buffer': cpc_buf,
		'hex'   : mBuffer.convBufferToHexString(cpc_buf),
		'desc'  : cpc_desc
	};
	structure.push(cpc);

	var parsed = {
		'message': {
			'power': cpc_value / 1000,
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
	if(typeof(power) !== 'number' || power < 0 || power > 999999.999) {
		throw new Error('The "power" property in the 1st argument "data" is invalid.');
	}

	var power_buf = Buffer.alloc(4);
	power_buf.writeUInt32BE(power * 1000);
	return power_buf;
};

module.exports = new EchonetLitePropertyParser();
