/* ------------------------------------------------------------------
* node-echonet-lite - 02-6F-E6.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 6F : Electric lock class
* - EPC              : E6 : Auto lock mode setting

* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'ALK': {
				'field': 'Auto lock mode setting',
				'values': {
					0x41: 'ON',
					0x42: 'OFF'
				}
			}
		},
		'ja': {
			'ALK': {
				'field': '自動施錠モード設定',
				'values': {
					0x41: '入',
					0x42: '切'
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
	// Auto lock mode setting
	let alk_buf = buf.slice(0, 1);
	let alk_key = 'ALK';
	let alk_value = alk_buf.readUInt8(0);
	let alk = {
		'key'   : alk_key,
		'field' : this.desc[alk_key]['field'],
		'value' : alk_value,
		'buffer': alk_buf,
		'hex'   : mBuffer.convBufferToHexString(alk_buf),
		'desc'  : this.desc[alk_key]['values'][alk_value]
	};
	structure.push(alk);

	let parsed = {
		'message': {
			'autoLock': (alk_value === 0x41) ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let alk = data['autoLock'];
	if(typeof(alk) !== 'boolean') {
		throw new Error('The "autoLock" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	var alk_value = alk ? 0x41 : 0x42;
	buf.writeUInt8(alk_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
