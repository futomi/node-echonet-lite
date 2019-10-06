/* ------------------------------------------------------------------
* node-echonet-lite - 02-72-E1.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-05
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 72 : Instantaneous water heater class
* - EPC              : E1 : Set value of bath temperature
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'SBT': {
				'field': 'Set value of bath temperature',
				'values': {}
			}
		},
		'ja': {
			'SBT': {
				'field': '風呂温度設定値',
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
	// Set value of bath temperature
	var sbt_buf = buf.slice(0, 1);
	var sbt_key = 'SBT';
	var sbt_value = sbt_buf.readUInt8(0);
	var sbt_desc = sbt_value.toString();
	if(this.lang === 'ja') {
		sbt_desc += ' ℃';
	} else {
		sbt_desc += ' °C';
	}
	var sbt = {
		'key'   : sbt_key,
		'field' : this.desc[sbt_key]['field'],
		'value' : sbt_value,
		'buffer': sbt_buf,
		'hex'   : mBuffer.convBufferToHexString(sbt_buf),
		'desc'  : sbt_desc
	};
	structure.push(sbt);

	var parsed = {
		'message': {
			'temperature': sbt_value
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
