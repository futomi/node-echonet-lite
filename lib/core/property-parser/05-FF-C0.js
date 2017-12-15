/* ------------------------------------------------------------------
* node-echonet-lite - 05-FF-C0.js
*
* Copyright (c) 2017, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2017-11-29
*
* - Class group code : 05 : Management/Operation-related Device Class Group
* - Class code       : FF : Controller
* - EPC              : C0 : Controller ID
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'CID': {
				'field': 'Controller ID',
				'values': {}
			}
		},
		'ja': {
			'CID': {
				'field': 'コントローラ ID',
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
	// Controller ID
	var cid_buf = buf.slice(0);
	var cid_key = 'CID';
	var cid_hex = mBuffer.convBufferToHexString(cid_buf);
	var cid_desc = cid_hex.join(' ');
	var cid = {
		'key'   : cid_key,
		'field' : this.desc[cid_key]['field'],
		'buffer': cid_buf,
		'hex'   : cid_hex,
		'desc'  : cid_desc
	};
	structure.push(cid);

	var parsed = {
		'message': {
			'id': cid_desc
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument `data` must be an object.');
	}
	var id = data['id'];
	if(typeof(id) !== 'string') {
		throw new Error('The `id` is invalid.');
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
