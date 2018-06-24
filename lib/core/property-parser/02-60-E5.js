/* ------------------------------------------------------------------
* node-echonet-lite - 02-60-E5.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 60 : Electrically operated blind/shade class
* - EPC              : E5 : Electric lock setting
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'ELS': {
				'field': 'Electric lock setting',
				'values': {
					0x41: 'Lock',
					0x42: 'Unlock'
				}
			}
		},
		'ja': {
			'ELS': {
				'field': '電気錠設定',
				'values': {
					0x41: '施錠',
					0x42: '開錠'
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
	// Electric lock setting
	let els_buf = buf.slice(0, 1);
	let els_key = 'ELS';
	let els_value = els_buf.readUInt8(0);
	let els = {
		'key'   : els_key,
		'field' : this.desc[els_key]['field'],
		'value' : els_value,
		'buffer': els_buf,
		'hex'   : mBuffer.convBufferToHexString(els_buf),
		'desc'  : this.desc[els_key]['values'][els_value]
	};
	structure.push(els);

	let parsed = {
		'message': {
			'lock': (els_value === 0x41) ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let lock = data['lock'];
	if(typeof(lock) !== 'boolean') {
		throw new Error('The "lock" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	var lock_value = lock ? 0x41 : 0x42;
	buf.writeUInt8(lock_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
