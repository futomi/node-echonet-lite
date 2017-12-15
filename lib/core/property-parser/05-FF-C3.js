/* ------------------------------------------------------------------
* node-echonet-lite - 05-FF-C3.js
*
* Copyright (c) 2017, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2017-11-29
*
* - Class group code : 05 : Management/Operation-related Device Class Group
* - Class code       : FF : Controller
* - EPC              : C3 : Device ID
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'DID': {
				'field': 'Device ID',
				'values': {}
			}
		},
		'ja': {
			'DID': {
				'field': '機器 ID',
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
	if(buf.length > 40) {
		return null;
	}
	// Device ID
	var did_buf = buf.slice(0);
	var did_key = 'DID';
	var did_hex = mBuffer.convBufferToHexString(did_buf);
	var did_desc = did_hex.join(' ');
	var did = {
		'key'   : did_key,
		'field' : this.desc[did_key]['field'],
		'buffer': did_buf,
		'hex'   : did_hex,
		'desc'  : did_desc
	};
	structure.push(did);

	var parsed = {
		'message': {
			'id': did_desc
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument `data` must be an object.');
	}
	if(!('id' in data)) {
		throw new Error('The `id` is required.');
	}
	var id = data['id'];
	if(typeof(id) !== 'string') {
		throw new Error('The `id` must be a string.');
	}
	id = id.replace(/\s+/g, '');
	if(!id.match(/^[\da-fA-F]+$/)) {
		throw new Error('The `id` is invalid.');
	} else if(id.length % 2 !== 0) {
		throw new Error('The `id` is invalid.');
	} else if(id.length > 80) {
		throw new Error('The `id` is invalid.');
	}

	var byte_len = id.length / 2;
	var buf = new Buffer(byte_len);
	for(var i=0; i<byte_len; i++) {
		let n = parseInt(id.substr(i*2, 2), 16);
		buf.writeUInt8(n, i);
	}
	return buf;
};

module.exports = new EchonetLitePropertyParser();
