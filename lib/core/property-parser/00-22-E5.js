/* ------------------------------------------------------------------
* node-echonet-lite - 00-22-E5.js
*
* Copyright (c) 2017, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2017-12-14
*
* - Class group code : 00 : Sensor-related Device Class Group
* - Class code       : 22 : Electric energy sensor class
* - EPC              : E5 : Effective voltage value
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'VOL': {
				'field': 'Effective voltage value',
				'values': {}
			}
		},
		'ja': {
			'VOL': {
				'field': '実効電圧値計測値',
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
	// Voltage
	var vol_buf = buf.slice(0, 2);
	var vol_key = 'VOL';
	var vol_value = vol_buf.readUInt16BE(0); // V
	var vol = {
		'key'   : vol_key,
		'field' : this.desc[vol_key]['field'],
		'value' : vol_value,
		'buffer': vol_buf,
		'hex'   : mBuffer.convBufferToHexString(vol_buf),
		'desc'  : vol_value.toString()
	};
	structure.push(vol);

	var parsed = {
		'message': {
			'voltage': vol_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument `data` must be an object.');
	}
	var voltage = data['voltage'];
	if(typeof(voltage) !== 'number' || voltage < 0 || voltage > 65533 || voltage % 1 > 0) {
		throw new Error('The `voltage` must be an integer between 0 and 65533.');
	}
	var buf = new Buffer(2);
	buf.writeUInt16BE(voltage);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
