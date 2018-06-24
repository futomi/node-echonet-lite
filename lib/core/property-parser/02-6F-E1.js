/* ------------------------------------------------------------------
* node-echonet-lite - 02-6F-E1.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 6F : Electric lock class
* - EPC              : E1 : Lock setting 2
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'LS2': {
				'field': 'Lock setting 2',
				'values': {
					0x41: 'Lock',
					0x42: 'Unlock'
				}
			}
		},
		'ja': {
			'LS2': {
				'field': '施錠設定２',
				'values': {
					0x41: '施錠',
					0x42: '解錠'
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
	// Lock setting 2
	let ls2_buf = buf.slice(0, 1);
	let ls2_key = 'LS2';
	let ls2_value = ls2_buf.readUInt8(0);
	let ls2 = {
		'key'   : ls2_key,
		'field' : this.desc[ls2_key]['field'],
		'value' : ls2_value,
		'buffer': ls2_buf,
		'hex'   : mBuffer.convBufferToHexString(ls2_buf),
		'desc'  : this.desc[ls2_key]['values'][ls2_value]
	};
	structure.push(ls2);

	let parsed = {
		'message': {
			'lock': (ls2_value === 0x41) ? true : false
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
