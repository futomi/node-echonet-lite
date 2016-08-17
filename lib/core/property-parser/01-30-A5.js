/* ------------------------------------------------------------------
* node-echonet-lite - 01-30-A5.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-06
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 30 : Home air conditioner class
* - EPC              : A5 : Air flow direction (horizontal) setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'MOD': {
				'field': 'Air flow direction (horizontal) setting',
				'values': {}
			}
		},
		'ja': {
			'MOD': {
				'field': '風向左右設定',
				'values': {}
			}
		}
	}
	this.desc = this.descs[this.lang];

	this.mode = {
		0x41: 0b00011,
		0x42: 0b11000,
		0x43: 0b01110,
		0x44: 0b11011,
		0x51: 0b00001,
		0x52: 0b00010,
		0x54: 0b00100,
		0x55: 0b00101,
		0x56: 0b00110,
		0x57: 0b00111,
		0x58: 0b01000,
		0x59: 0b01001,
		0x5A: 0b01010,
		0x5B: 0b01011,
		0x5C: 0b01100,
		0x5D: 0b01101,
		0x5F: 0b01111,
		0x60: 0b10000,
		0x61: 0b10001,
		0x62: 0b10010,
		0x63: 0b10011,
		0x64: 0b10100,
		0x65: 0b10101,
		0x66: 0b10110,
		0x67: 0b10111,
		0x69: 0b11001,
		0x6A: 0b11010,
		0x6C: 0b11100,
		0x6D: 0b11101,
		0x6E: 0b11110,
		0x6F: 0b11111
	}
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
	// Air flow direction (horizontal) setting
	var mod_buf = buf.slice(0, 1);
	var mod_key = 'MOD';
	var mod_value = mod_buf.readUInt8(0);
	var mod_pos_value = this.mode[mod_value] || 0;
	var mod_pos_list = [
		(mod_pos_value & 0b10000) ? true : false,
		(mod_pos_value & 0b01000) ? true : false,
		(mod_pos_value & 0b00100) ? true : false,
		(mod_pos_value & 0b00010) ? true : false,
		(mod_pos_value & 0b00001) ? true : false
	];
	var mod_desc = '';
	mod_pos_list.forEach((m) => {
		mod_desc += (m ? '|' : '-');
	});
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
			'directions': mod_pos_list
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var directions = data['directions'];
	if(!directions || !Array.isArray(directions) || directions.length !== 5) {
		throw new Error('The "directions" property in the 1st argument "data" is invalid.');
	}
	var mode_bin = '';
	directions.forEach((m) => {
		mode_bin += (m ? '1' : '0');
	});
	var mode_value = parseInt(mode_bin, 2);
	var mode = 0;
	for(var k in this.mode) {
		var v = this.mode[k];
		if(v === mode_value) {
			mode = k;
			break;
		}
	}
	if(mode === 0) {
		throw new Error('The "directions" property in the 1st argument "data" is invalid.');
	}
	var buf = new Buffer(1);
	buf.writeUInt8(mode);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
