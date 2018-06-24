/* ------------------------------------------------------------------
* node-echonet-lite - 02-60-90.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 60 : Electrically operated blind/shade class
* - EPC              : 90 : Timer operation setting
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'TIM': {
				'field': 'Timer operation setting',
				'values': {
					0x41: 'ON',
					0x42: 'OFF'
				}
			}
		},
		'ja': {
			'TIM': {
				'field': 'タイマ動作設定',
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
	// Timer operation setting
	let tim_buf = buf.slice(0, 1);
	let tim_key = 'TIM';
	let tim_value = tim_buf.readUInt8(0);
	let tim = {
		'key'   : tim_key,
		'field' : this.desc[tim_key]['field'],
		'value' : tim_value,
		'buffer': tim_buf,
		'hex'   : mBuffer.convBufferToHexString(tim_buf),
		'desc'  : this.desc[tim_key]['values'][tim_value]
	};
	structure.push(tim);

	let parsed = {
		'message': {
			'timer': (tim_value === 0x41) ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let timer = data['timer'];
	if(typeof(timer) !== 'boolean') {
		throw new Error('The "timer" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	var timer_value = timer ? 0x41 : 0x42;
	buf.writeUInt8(timer_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
