/* ------------------------------------------------------------------
* node-echonet-lite - 00-2D-E0.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-02
*
* - Class group code : 00 : Sensor-related device class group
* - Class code       : 2D : Air pressure sensor class
* - EPC              : E0 : Air pressure measurement
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'PRE': {
				'field': 'Air pressure',
				'values': {}
			}
		},
		'ja': {
			'PRE': {
				'field': '気圧',
				'values': {}
			}
		}
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
	// Air pressure
	var pre_buf = buf.slice(0, 2);
	var pre_key = 'PRE';
	var pre_value = pre_buf.readUInt16BE(0);
	var pressure = pre_value / 10;
	var pre_desc = pressure.toString() + ' hPa';

	if(pre_value === 0xFFFF) {
		pre_desc = '> 6553.3 hPa';
	} else if(pre_value === 0xFFFE) {
		pre_desc = '< 0 hPa';
	}

	var pre = {
		'key'   : pre_key,
		'field' : this.desc[pre_key]['field'],
		'value' : pre_value,
		'buffer': pre_buf,
		'hex'   : mBuffer.convBufferToHexString(pre_buf),
		'desc'  : pre_desc
	};
	structure.push(pre);

	var parsed = {
		'message': {
			'pressure': pressure
		},
		'structure': structure
	}
	return parsed;
};


EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var pressure = data['pressure'];
	if(typeof(pressure) !== 'number' || pressure < 0 || pressure > 6553.3) {
		throw new Error('The "pressure" property in the 1st argument "data" is invalid.');
	}
	var pre = pressure.toFixed(1) * 10;
	var buf = new Buffer(2);
	buf.writeUInt16BE(pre);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
