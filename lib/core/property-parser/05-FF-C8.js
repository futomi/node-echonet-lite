/* ------------------------------------------------------------------
* node-echonet-lite - 05-FF-C8.js
*
* Copyright (c) 2017, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2017-11-30
*
* - Class group code : 05 : Management/Operation-related Device Class Group
* - Class code       : FF : Controller
* - EPC              : C8 : Product code of the device to be controlled
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'PRC': {
				'field': 'Product code of the device to be controlled',
				'values': {}
			}
		},
		'ja': {
			'PRC': {
				'field': '管理対象機器商品コード',
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
	// Product code of the device to be controlled
	var prc_buf = buf.slice(0);
	var prc_key = 'PRC';
	var prc_hex = mBuffer.convBufferToHexString(prc_buf);
	var prc_desc = prc_buf.toString('utf8');
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
		throw new Error('The 1st argument `data` must be an object.');
	}
	var code = data['code'];
	if(!('code' in data)) {
		throw new Error('The `code` is required.');
	} else if(typeof(code) !== 'string') {
		throw new Error('The `code` must be a string.');
	} else if(!code.match(/^[\x20-\x7E]+$/)) {
		throw new Error('The `code` must be an ASCII string.');
	}
	var buf = Buffer.from(code, 'utf8');
	if(buf.length > 12) {
		throw new Error('The `name` is too long.');
	}
	return buf;
};

module.exports = new EchonetLitePropertyParser();
