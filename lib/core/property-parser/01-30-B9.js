/* ------------------------------------------------------------------
* node-echonet-lite - 01-30-B9.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 30 : Home air conditioner class
* - EPC              : B9 : Measured value of current consumption
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');;

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'CRT': {
				'field': 'Current consumption',
				'values': {}
			}
		},
		'ja': {
			'CRT': {
				'field': '消費電流',
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
	// Current consumption
	var crt_buf = buf.slice(0, 2);
	var crt_key = 'CRT';
	var crt_value = crt_buf.readUInt16BE(0);
	var current = crt_value / 10;
	var crt_desc = current.toString() + ' A';

	var crt = {
		'key'   : crt_key,
		'field' : this.desc[crt_key]['field'],
		'value' : crt_value,
		'buffer': crt_buf,
		'hex'   : mBuffer.convBufferToHexString(crt_buf),
		'desc'  : crt_desc
	};
	structure.push(crt);

	var parsed = {
		'message': {
			'current': current
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var current = data['current'];
	if(typeof(current) !== 'number' || current < 0 || current > 6553.3) {
		throw new Error('The "temperature" property in the 1st argument "data" is invalid.');
	}

	current = current.toFixed(1) * 10;
	var buf = Buffer.alloc(2);
	buf.writeUInt16BE(current);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
