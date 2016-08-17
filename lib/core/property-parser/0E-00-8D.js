/* ------------------------------------------------------------------
* node-echonet-lite - 0E-00-8D
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-06
*
* - Class group code : 0E : Profile class group
* - Class code       : 00 : Profile Object Super Class
* - EPC              : 8D : Production number
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'PRN': {
				'field': 'Production number',
				'values': {}
			}
		},
		'ja': {
			'PRN': {
				'field': '製造番号',
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
	// Production number
	var prn_buf = buf.slice(0, 12);
	var prn_key = 'PRN';
	var prn_hex = mBuffer.convBufferToHexString(prn_buf);
	var prn_desc = '';
	for(var i=0; i<12; i++) {
		var c = prn_buf.readUInt8(i);
		if(c === 0x00) {
			break;
		}
		prn_desc += String.fromCharCode(c);
	}
	var prn = {
		'key'   : prn_key,
		'field' : this.desc[prn_key]['field'],
		'buffer': prn_buf,
		'hex'   : prn_hex,
		'desc'  : prn_desc
	};
	structure.push(prn);

	var parsed = {
		'message': {
			'number': prn_desc
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var number = data['number'];
	if(typeof(number) !== 'string') {
		throw new Error('The "number" property in the 1st argument "data" is invalid.');
	} else if(!number.match(/^[\x20-\x7E]+$/)) {
		throw new Error('The "number" property in the 1st argument "data" is invalid.');
	}
	var buf = new Buffer(12);
	var len = number.length;
	for(var i=0; i<12; i++) {
		if(i < len) {
			buf.writeUInt8(number.charCodeAt(i), i);
		} else {
			buf.writeUInt8(0x00, i);
		}
	}
	return buf;
};

module.exports = new EchonetLitePropertyParser();
