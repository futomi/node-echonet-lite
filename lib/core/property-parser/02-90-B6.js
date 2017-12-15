/* ------------------------------------------------------------------
* node-echonet-lite - 02-90-B6.js
*
* Copyright (c) 2017, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2017-11-30
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 90 : General lighting class
* - EPC              : B6 : Lighting mode setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'MOD': {
				'field': 'Lighting mode setting',
				'values': {
					0x41: 'Auto',
					0x42: 'Main lighting',
					0x43: 'Night lighting',
					0x45: 'Color lighting'
				}
			}
		},
		'ja': {
			'MOD': {
				'field': '点灯モード設定',
				'values': {
					0x41: '自動',
					0x42: '通常灯',
					0x43: '常夜灯',
					0x45: 'カラー灯'
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
	// Lighting mode setting'
	var mod_buf = buf.slice(0, 1);
	var mod_key = 'MOD';
	var mod_value = mod_buf.readUInt8(0);
	var mod = {
		'key'   : mod_key,
		'field' : this.desc[mod_key]['field'],
		'value' : mod_value,
		'buffer': mod_buf,
		'hex'   : mBuffer.convBufferToHexString(mod_buf),
		'desc'  : this.desc[mod_key]['values'][mod_value]
	};
	structure.push(mod);

	var parsed = {
		'message': {
			'mode': mod_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument `data` must be an object.');
	}
	var mode = data['mode'];
	if(!('mode' in data)) {
		throw new Error('The `mode` is required.');
	} else if(typeof(mode) !== 'number') {
		throw new Error('The `mode` must be a number.');
	} else if(!(mode === 0x41 || mode === 0x42 || mode === 0x43 || mode === 0x45)) {
		throw new Error('The `mode` must be 0x40, 0x41, 0x42, 0x43, or 0x45.');
	}
	var buf = Buffer.from([mode]);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
