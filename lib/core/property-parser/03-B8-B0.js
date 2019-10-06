/* ------------------------------------------------------------------
* node-echonet-lite - 03-B8-B0.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-06
*
* - Class group code : 03 : Housing/Facilities-related Device Class Group
* - Class code       : B8 : Combination microwave oven (electronic oven) class
* - EPC              : B0 : Door open/close status
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'DOC': {
				'field': 'Door open/close status',
				'values': {
					0x41: 'Door open',
					0x42: 'Door closed'
				}
			}
		},
		'ja': {
			'DOC': {
				'field': 'ドア開閉状態',
				'values': {
					0x41: 'ドア開',
					0x42: 'ドア閉'
				}
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
	if(buf.length !== 1) {
		return null;
	}
	// Door open/close status
	var doc_buf = buf.slice(0, 1);
	var doc_key = 'DOC';
	var doc_value = doc_buf.readUInt8(0);
	var doc_desc = this.desc[doc_key]['values'][doc_value] || '';
	var doc = {
		'key'   : doc_key,
		'field' : this.desc[doc_key]['field'],
		'value' : doc_value,
		'buffer': doc_buf,
		'hex'   : mBuffer.convBufferToHexString(doc_buf),
		'desc'  : doc_desc
	};
	structure.push(doc);

	var parsed = {
		'message': {
			'status': (doc_value === 0x41) ? true : false,
			'desc': doc_desc
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var status = data['status'];
	if(typeof(status) !== 'boolean') {
		throw new Error('The "status" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	var status_value = status ? 0x41 : 0x42;
	buf.writeUInt8(status_value);
	return buf;
};


module.exports = new EchonetLitePropertyParser();
