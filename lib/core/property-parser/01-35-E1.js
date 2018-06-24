/* ------------------------------------------------------------------
* node-echonet-lite - 01-35-E1.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 35 : Air cleaner class
* - EPC              : E1 : Filter change notice
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'FLT': {
				'field': 'Filter change notice',
				'values': {
					0x41: 'Found',
					0x42: 'Not found'
				}
			}
		},
		'ja': {
			'FLT': {
				'field': 'フィルター交換通知状態',
				'values': {
					0x41: '有',
					0x42: '無'
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
	let structure = [];
	// Check the length of the buffer
	if(buf.length !== 1) {
		return null;
	}
	// Filter change notice
	let flt_buf = buf.slice(0, 1);
	let flt_key = 'FLT';
	let flt_value = flt_buf.readUInt8(0);
	let flt = {
		'key'   : flt_key,
		'field' : this.desc[flt_key]['field'],
		'value' : flt_value,
		'buffer': flt_buf,
		'hex'   : mBuffer.convBufferToHexString(flt_buf),
		'desc'  : this.desc[flt_key]['values'][flt_value]
	};
	structure.push(flt);

	let parsed = {
		'message': {
			'notice': (flt_value === 0x41) ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let notice = data['notice'];
	if(typeof(notice) !== 'boolean') {
		throw new Error('The "notice" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	var notice_value = notice ? 0x41 : 0x42;
	buf.writeUInt8(notice_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
