/* ------------------------------------------------------------------
* node-echonet-lite - 02-88-D7.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-02
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 88 : Low voltage smart electric energy meter class
* - EPC              : D7 : Number of effective digits for cumulative amounts of electric energy
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'DIG': {
				'field': 'Digit',
				'values': {}
			}
		},
		'ja': {
			'DIG': {
				'field': '有効桁数',
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
	// Number of effective digits
	var dig_buf = buf.slice(0, 1);
	var dig_key = 'DIG';
	var dig_value = dig_buf.readUInt8(0);
	var dig = {
		'key'   : dig_key,
		'field' : this.desc[dig_key]['field'],
		'value' : dig_value,
		'buffer': dig_buf,
		'hex'   : mBuffer.convBufferToHexString(dig_buf),
		'desc'  : dig_value.toString()
	};
	structure.push(dig);

	var parsed = {
		'message': {
			'digit': dig_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var digit = data['digit'];
	if(typeof(digit) !== 'number' || digit < 1 || digit > 8 || digit % 1 > 0) {
		throw new Error('The "digit" property in the 1st argument "data" is invalid.');
	}
	var buf = new Buffer(1);
	buf.writeUInt8(digit);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
