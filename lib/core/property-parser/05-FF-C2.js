/* ------------------------------------------------------------------
* node-echonet-lite - 05-FF-C1.js
*
* Copyright (c) 2017-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 05 : Management/Operation-related Device Class Group
* - Class code       : FF : Controller
* - EPC              : C2 : Index
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'IDX': {
				'field': 'Index',
				'values': {}
			}
		},
		'ja': {
			'IDX': {
				'field': 'インデックス',
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
	// Index
	var idx_buf = buf.slice(0);
	var idx_key = 'IDX';
	var idx_hex = mBuffer.convBufferToHexString(idx_buf);
	var idx_value = idx_buf.readUInt16BE(0);
	var idx_desc = idx_value.toString();
	var idx = {
		'key'   : idx_key,
		'field' : this.desc[idx_key]['field'],
		'value' : idx_value,
		'buffer': idx_buf,
		'hex'   : idx_hex,
		'desc'  : idx_desc
	};
	structure.push(idx);

	var parsed = {
		'message': {
			'index': idx_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument `data` must be an object.');
	}
	var idx = data['index'];
	if(!('index' in data)) {
		throw new Error('The `index` is required.');
	} else if(typeof(idx) !== 'number') {
		throw new Error('The `index` must be an integer between 0 and 0xFFFF.');
	} else if(idx % 1 !== 0) {
		throw new Error('The `index` must be an integer between 0 and 0xFFFF.');
	} else if(idx < 0 || idx > 0xffff) {
		throw new Error('The `index` must be an integer between 0 and 0xFFFF.');
	}

	var buf = Buffer.alloc(2);
	buf.writeUInt16BE(idx, 0);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
