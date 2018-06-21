/* ------------------------------------------------------------------
* node-echonet-lite - 05-FF-C1.js
*
* Copyright (c) 2017-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 05 : Management/Operation-related Device Class Group
* - Class code       : FF : Controller
* - EPC              : C1 : Number of devices controlled
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'NUM': {
				'field': 'Number of devices controlled',
				'values': {}
			}
		},
		'ja': {
			'NUM': {
				'field': '管理台数',
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
	// Number of devices controlled
	var num_buf = buf.slice(0);
	var num_key = 'NUM';
	var num_hex = mBuffer.convBufferToHexString(num_buf);
	var num_value = num_buf.readUInt16BE(0);
	var num_desc = num_value.toString();
	var num = {
		'key'   : num_key,
		'field' : this.desc[num_key]['field'],
		'value' : num_value,
		'buffer': num_buf,
		'hex'   : num_hex,
		'desc'  : num_desc
	};
	structure.push(num);

	var parsed = {
		'message': {
			'number': num_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument `data` must be an object.');
	}
	var num = data['number'];
	if(!('number' in data)) {
		throw new Error('The `number` is required.');
	} else if(typeof(num) !== 'number') {
		throw new Error('The `number` must be an integer between 0 and 0xFF.');
	} else if(num % 1 !== 0) {
		throw new Error('The `number` must be an integer between 0 and 0xFF.');
	} else if(num < 0 || num > 0xff) {
		throw new Error('The `number` must be an integer between 0 and 0xFF.');
	}
	var buf = Buffer.alloc(2);
	buf.writeUInt16BE(num, 0);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
