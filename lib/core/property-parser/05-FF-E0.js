/* ------------------------------------------------------------------
* node-echonet-lite - 05-FF-E0.js
*
* Copyright (c) 2017, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2017-11-29
*
* - Class group code : 05 : Management/Operation-related Device Class Group
* - Class code       : FF : Controller
* - EPC              : E0 : Address of installation location
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'ADR': {
				'field': 'Address of installation location',
				'values': {}
			}
		},
		'ja': {
			'ADR': {
				'field': '設置住所',
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
	if(buf.length > 64) {
		return null;
	}
	// Address of installation location
	var adr_buf = buf.slice(0);
	var adr_key = 'ADR';
	var adr_hex = mBuffer.convBufferToHexString(adr_buf);
	var adr_desc = adr_buf.toString('utf8');
	var adr = {
		'key'   : adr_key,
		'field' : this.desc[adr_key]['field'],
		'buffer': adr_buf,
		'hex'   : adr_hex,
		'desc'  : adr_desc
	};
	structure.push(adr);

	var parsed = {
		'message': {
			'address': adr_desc
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument `data` must be an object.');
	}
	var adr = data['address'];
	if(!('address' in data)) {
		throw new Error('The `address` is required.');
	} else if(typeof(adr) !== 'string') {
		throw new Error('The `address` must be a string.');
	}
	var buf = Buffer.from(adr, 'utf8');
	if(buf.length > 255) {
		throw new Error('The `address` is too long.');
	}
	return buf;
};

module.exports = new EchonetLitePropertyParser();
