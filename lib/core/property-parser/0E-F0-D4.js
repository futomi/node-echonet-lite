/* ------------------------------------------------------------------
* node-echonet-lite - 0E-F0-D4.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 0E : Profile class group
* - Class code       : F0 : Node profile class
* - EPC              : D4 : Number of self-node classes
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'NUM': 'Total number of classes'
		},
		'ja': {
			'NUM': 'クラス総数'
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
	// Total number of classes
	var num_buf = buf.slice(0, 2);
	var num_value = buf.readUInt16BE(0);
	var num_key = 'NUM';
	var num = {
		'key'   : num_key,
		'field' : this.desc[num_key],
		'value' : num_value,
		'buffer': num_buf,
		'hex'   : mBuffer.convBufferToHexString(num_buf),
		'desc'  : num_value.toString()
	};
	structure.push(num);

	var parsed = {
		'message': {
			'num': num_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var num = data['num'];
	if(typeof(num) !== 'number' || num % 1 > 0 || num < 0 || num > 0xFFFF) {
		throw new Error('The "num" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(2);
	buf.writeUInt16BE(num, 0);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
