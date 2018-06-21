/* ------------------------------------------------------------------
* node-echonet-lite - 01-30-90.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 30 : Home air conditioner class
* - EPC              : 90 : ON timer-based reservation setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'MOD': {
				'field': 'ON timer-based reservation setting',
				'values': {
					0x41: 'Both the time- and relative time-based reservation functions are ON',
					0x42: 'Both reservation functions are OFF',
					0x43: 'Time-based reservation function is ON',
					0x44: 'Relative time-based reservation function is ON'
				}
			}
		},
		'ja': {
			'MOD': {
				'field': 'ONタイマ予約設定',
				'values': {
					0x41: '時刻予約,相対時間予約共に入',
					0x42: '予約切',
					0x43: '時刻予約のみ入り',
					0x44: '相対時刻予約のみ入り'
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
	// Air purification mode setting
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
			'mode': mod_value - 0x41,
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
	if(typeof(mode) !== 'number' || mode < 1 || mode > 4 || mode % 1 > 0) {
		throw new Error('The "mode" property in the 1st argument "data" is invalid.');
	}
	var mode_value = mode + 0x40;
	var buf = Buffer.alloc(1);
	buf.writeInt8(mode_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
