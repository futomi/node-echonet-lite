/* ------------------------------------------------------------------
* node-echonet-lite - 02-72-D1.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-05
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 72 : Instantaneous water heater class
* - EPC              : D1 : Set value of hot water temperature
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'SHT': {
				'field': 'Set value of hot water temperature',
				'values': {}
			}
		},
		'ja': {
			'SHT': {
				'field': '給湯温度設定値',
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
	if(buf.length !== 1) {
		return null;
	}
	// Set value of hot water temperature
	var sht_buf = buf.slice(0, 1);
	var sht_key = 'SHT';
	var sht_value = sht_buf.readUInt8(0);
	var sht_desc = sht_value.toString();
	if(this.lang === 'ja') {
		sht_desc += ' ℃';
	} else {
		sht_desc += ' °C';
	}
	var sht = {
		'key'   : sht_key,
		'field' : this.desc[sht_key]['field'],
		'value' : sht_value,
		'buffer': sht_buf,
		'hex'   : mBuffer.convBufferToHexString(sht_buf),
		'desc'  : sht_desc
	};
	structure.push(sht);

	var parsed = {
		'message': {
			'temperature': sht_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var temperature = data['temperature'];
	if(typeof(temperature) !== 'number' || temperature < 0 || temperature > 100 || temperature % 1 > 0) {
		throw new Error('The "temperature" property in the 1st argument "data" is invalid.');
	}

	var buf = Buffer.alloc(1);
	buf.writeUInt8(temperature);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
