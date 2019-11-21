/* ------------------------------------------------------------------
* node-echonet-lite - 00-02-B1.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-30
*
* - Class group code : 00 : Sensor-related Device Class Group
* - Class code       : 02 : Crime prevention sensor class
* - EPC              : B1 : Invasion occurrence status resetting
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'ISR': {
				'field': 'Invasion occurrence status resetting',
				'values': {
					0x00: 'Reset',
				}
			}
		},
		'ja': {
			'ISR': {
				'field': '侵入発生状態リセット設定',
				'values': {
					0x00: 'リセット',
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
	// Invasion occurrence status resetting
	let isr_buf = buf.slice(0, 1);
	let isr_key = 'ISR';
	let isr_value = isr_buf.readUInt8(0);
	let isr_desc = this.desc[isr_key]['values'][isr_value] || '';
	let isr = {
		'key'   : isr_key,
		'field' : this.desc[isr_key]['field'],
		'value' : isr_value,
		'buffer': isr_buf,
		'hex'   : mBuffer.convBufferToHexString(isr_buf),
		'desc'  : isr_desc
	};
	structure.push(isr);

	let parsed = {
		'message': {
			'reset': true
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if (typeof (data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let reset = data['reset'];
	if (typeof (reset) !== 'boolean') {
		throw new Error('The "reset" must be boolean.');
	}
	let buf = Buffer.from([0x00]);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
