/* ------------------------------------------------------------------
* node-echonet-lite - 0E-00-8B.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-06
*
* - Class group code : 0E : Profile class group
* - Class code       : 00 : Profile Object Super Class
* - EPC              : 8B : Business facility code
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'BFC': {
				'field': 'Business facility code',
				'values': {}
			}
		},
		'ja': {
			'BFC': {
				'field': '事業場コード',
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
	// Manufacturer code
	var bfc_buf = buf.slice(0, 3);
	var bfc_key = 'BFC';
	var bfc_value = Buffer.concat([(new Buffer([0x00])), bfc_buf]).readUInt32BE(0);
	var bfc_hex = mBuffer.convBufferToHexString(bfc_buf);
	var bfc_desc = bfc_hex.join(' ');
	var bfc = {
		'key'   : bfc_key,
		'field' : this.desc[bfc_key]['field'],
		'value' : bfc_value,
		'buffer': bfc_buf,
		'hex'   : bfc_hex,
		'desc'  : bfc_desc
	};
	structure.push(bfc);

	var parsed = {
		'message': {
			'code': bfc_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var code = data['code'];
	if(typeof(code) !== 'number') {
		throw new Error('The "code" property in the 1st argument "data" is invalid.');
	}
	var buf = new Buffer(4);
	buf.writeUInt32BE(code);
	buf = buf.slice(1, 4);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
