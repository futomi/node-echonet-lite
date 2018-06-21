/* ------------------------------------------------------------------
* node-echonet-lite - 01-30-A4.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 30 : Home air conditioner class
* - EPC              : A4 : Air flow direction (vertical) setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'MOD': {
				'field': 'Air flow direction (vertical) setting',
				'values': {
					0x41: 'Uppermost',
					0x42: 'Lowermost',
					0x43: 'Central',
					0x44: 'Midpoint between uppermost and central',
					0x45: 'Midpoint between lowermost and central'
				}
			}
		},
		'ja': {
			'MOD': {
				'field': '風向上下設定',
				'values': {
					0x41: '上',
					0x42: '下',
					0x43: '中央',
					0x44: '上中',
					0x45: '下中'
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
	// Air flow direction (vertical) setting
	var mod_buf = buf.slice(0, 1);
	var mod_key = 'MOD';
	var mod_value = mod_buf.readUInt8(0);
	var mod_desc = this.desc[mod_key]['values'][mod_value] || '';
	var mod = {
		'key'   : mod_key,
		'field' : this.desc[mod_key]['field'],
		'value' : mod_value,
		'buffer': mod_buf,
		'hex'   : mBuffer.convBufferToHexString(mod_buf),
		'desc'  : mod_desc
	};
	structure.push(mod);

	var parsed = {
		'message': {
			'mode': mod_value - 0x40,
			'desc': mod_desc
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var mode = data['mode'];
	if(typeof(mode) !== 'number' || mode < 1 || mode > 5 || mode % 1 > 0) {
		throw new Error('The "mode" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	buf.writeUInt8(mode + 0x40);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
