/* ------------------------------------------------------------------
* node-echonet-lite - 02-6F-E2.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 6F : Electric lock class
* - EPC              : E2 : Lock status of door guard
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'DOG': {
				'field': 'Lock status of door guard',
				'values': {
					0x41: 'Lock',
					0x42: 'Unlock'
				}
			}
		},
		'ja': {
			'DOG': {
				'field': 'ドアガード施錠状態',
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
	// Lock status of door guard
	let dog_buf = buf.slice(0, 1);
	let dog_key = 'DOG';
	let dog_value = dog_buf.readUInt8(0);
	let dog = {
		'key'   : dog_key,
		'field' : this.desc[dog_key]['field'],
		'value' : dog_value,
		'buffer': dog_buf,
		'hex'   : mBuffer.convBufferToHexString(dog_buf),
		'desc'  : this.desc[dog_key]['values'][dog_value]
	};
	structure.push(dog);

	let parsed = {
		'message': {
			'lock': (dog_value === 0x41) ? true : false
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
