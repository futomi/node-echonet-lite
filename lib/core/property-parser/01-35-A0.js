/* ------------------------------------------------------------------
* node-echonet-lite - 01-35-A0.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 35 : Air cleaner class
* - EPC              : A0 : Air flow rate setting
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'AFR': {
				'field': 'Air flow rate setting',
				'values': {
					0x41: 'Ventilation air flow rate auto status'
				}
			}
		},
		'ja': {
			'AFR': {
				'field': '風量設定',
				'values': {
					0x41: '換気風量自動状態'
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
	// Air flow rate setting
	let afr_buf = buf.slice(0, 1);
	let afr_key = 'AFR';
	let afr_value = afr_buf.readUInt8(0);
	let afr_desc = '';
	let afr_level = 0;
	if(afr_value === 0x41) {
		afr_level = 0;
		afr_desc = this.desc[afr_key]['values'][afr_value];
	} else if(afr_value >= 0x31 && afr_value <= 0x38) {
		afr_level = afr_value - 0x30;
		afr_desc = afr_level.toString() 
	}
	let afr = {
		'key'   : afr_key,
		'field' : this.desc[afr_key]['field'],
		'value' : afr_value,
		'buffer': afr_buf,
		'hex'   : mBuffer.convBufferToHexString(afr_buf),
		'desc'  : afr_desc
	};
	structure.push(afr);

	let parsed = {
		'message': {
			'level': afr_level
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let level = data['level'];
	if(typeof(level) !== 'number' || level < 0 || level > 8 || level % 1 > 0) {
		throw new Error('The "level" property in the 1st argument "data" is invalid.');
	}
	let level_value = 0x41;
	if(level > 0) {
		level_value = 0x30 + level;
	}
	let buf = Buffer.alloc(1);
	buf.writeUInt8(level_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
