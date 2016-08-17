/* ------------------------------------------------------------------
* node-echonet-lite - 0E-00-8C.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-06
*
* - Class group code : 0E : Profile class group
* - Class code       : 00 : Profile Object Super Class
* - EPC              : 8C : Product code
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'PRC': {
				'field': 'Product code',
				'values': {}
			}
		},
		'ja': {
			'PRC': {
				'field': '商品コード',
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
	if(buf.length !== 12) {
		return null;
	}
	// Product code
	var prc_buf = buf.slice(0, 12);
	var prc_key = 'PRC';
	var prc_hex = mBuffer.convBufferToHexString(prc_buf);
	var prc_desc = '';
	for(var i=0; i<12; i++) {
		var c = prc_buf.readUInt8(i);
		if(c === 0x00) {
			break;
		}
		prc_desc += String.fromCharCode(c);
	}
	var prc = {
		'key'   : prc_key,
		'field' : this.desc[prc_key]['field'],
		'buffer': prc_buf,
		'hex'   : prc_hex,
		'desc'  : prc_desc
	};
	structure.push(prc);

	var parsed = {
		'message': {
			'code': prc_desc
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
	if(typeof(code) !== 'string') {
		throw new Error('The "code" property in the 1st argument "data" is invalid.');
	} else if(!code.match(/^[\x20-\x7E]+$/)) {
		throw new Error('The "code" property in the 1st argument "data" is invalid.');
	}
	var buf = new Buffer(12);
	var len = code.length;
	for(var i=0; i<12; i++) {
		if(i < len) {
			buf.writeUInt8(code.charCodeAt(i), i);
		} else {
			buf.writeUInt8(0x00, i);
		}
	}
	return buf;
};

module.exports = new EchonetLitePropertyParser();
