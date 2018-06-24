/* ------------------------------------------------------------------
* node-echonet-lite - 02-60-D4.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 60 : Electrically operated blind/shade class
* - EPC              : D4 : Automatic operation setting
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'AOP': {
				'field': 'Automatic operation setting',
				'values': {
					0x41: 'ON',
					0x42: 'OFF'
				}
			}
		},
		'ja': {
			'AOP': {
				'field': '自動動作設定',
				'values': {
					0x41: 'ON',
					0x42: 'OFF'
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
	// Automatic operation setting
	let aop_buf = buf.slice(0, 1);
	let aop_key = 'AOP';
	let aop_value = aop_buf.readUInt8(0);
	let aop = {
		'key'   : aop_key,
		'field' : this.desc[aop_key]['field'],
		'value' : aop_value,
		'buffer': aop_buf,
		'hex'   : mBuffer.convBufferToHexString(aop_buf),
		'desc'  : this.desc[aop_key]['values'][aop_value]
	};
	structure.push(aop);

	let parsed = {
		'message': {
			'auto': (aop_value === 0x41) ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let auto = data['auto'];
	if(typeof(auto) !== 'boolean') {
		throw new Error('The "auto" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	var auto_value = auto ? 0x41 : 0x42;
	buf.writeUInt8(auto_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
