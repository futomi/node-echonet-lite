/* ------------------------------------------------------------------
* node-echonet-lite - 02-90-C0.js
*
* Copyright (c) 2017, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2017-12-01
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 90 : General lighting class
* - EPC              : C0 : RGB setting for color lighting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'R': {
				'field': 'R',
				'values': {}
			},
			'G': {
				'field': 'G',
				'values': {}
			},
			'B': {
				'field': 'B',
				'values': {}
			}
		},
		'ja': {
			'R': {
				'field': 'R',
				'values': {}
			},
			'G': {
				'field': 'G',
				'values': {}
			},
			'B': {
				'field': 'B',
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
	if(buf.length !== 3) {
		return null;
	}
	// RGB
	var message = {};
	var offset = 0;
	['R', 'G', 'B'].forEach((key) => {
		var c_buf = buf.slice(offset, offset+1);
		var value = c_buf.readUInt8(0);
		var c = {
			'key'   : key,
			'field' : this.desc[key]['field'],
			'value' : value,
			'buffer': c_buf,
			'hex'   : mBuffer.convBufferToHexString(c_buf),
			'desc'  : value.toString()
		};
		structure.push(c);
		message[key.toLowerCase()] = value;
		offset ++;
	});

	var parsed = {
		'message': message,
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument `data` must be an object.');
	}
	var byte_list = [];
	['r', 'g', 'b'].forEach((key) => {
		var v = data[key];
		if(!(key in data)) {
			throw new Error('The `' + key + '` is required.');
		} else if(typeof(v) !== 'number' || v < 0 || v > 255 || v % 1 !== 0) {
			throw new Error('The `' + key + '` must be an integer between 0 and 255.');
		}
		byte_list.push(v);
	});
	var buf = Buffer.from(byte_list);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
