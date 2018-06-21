/* ------------------------------------------------------------------
* node-echonet-lite - 02-88-E5.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 88 : Low voltage smart electric energy meter class
* - EPC              : E5 : Day for which the historical data of measured cumulative amounts of electric energy is to be retrieved 1
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'DAY': {
				'field': 'Day',
				'values': {}
			}
		},
		'ja': {
			'DAY': {
				'field': '日',
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
	if(buf.length !== 1) {
		return null;
	}
	// Day
	var day_buf = buf.slice(0, 1);
	var day_key = 'DAY';
	var day_value = day_buf.readUInt8(0);
	var day = {
		'key'   : day_key,
		'field' : this.desc[day_key]['field'],
		'value' : day_value,
		'buffer': day_buf,
		'hex'   : mBuffer.convBufferToHexString(day_buf),
		'desc'  : day_value.toString()
	};
	structure.push(day);

	var parsed = {
		'message': {
			'day': day_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var day = data['day'];
	if(typeof(day) !== 'number' || day < 0 || day > 99 || day % 1 > 0) {
		throw new Error('The "day" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	buf.writeUInt8(day);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
