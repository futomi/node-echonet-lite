/* ------------------------------------------------------------------
* node-echonet-lite - 01-30-A0.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 30 : Home air conditioner class
* - EPC              : A0 : Air flow rate setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'AFR': {
				'field': 'Air flow rate setting',
				'values': {
					0x41: 'Automatic air flow rate control function used'
				}
			}
		},
		'ja': {
			'AFR': {
				'field': '風量設定',
				'values': {
					0x41: '風量自動設定'
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
	// Set temperature value
	var afr_buf = buf.slice(0, 1);
	var afr_key = 'AFR';
	var afr_value = afr_buf.readUInt8(0);
	var afr_desc = '';
	var afr_level = 0;
	if(afr_value === 0x41) {
		afr_level = 0;
		afr_desc = this.desc[afr_key]['values'][afr_value];
	} else if(afr_value >= 0x31 && afr_value <= 0x38) {
		afr_level = afr_value - 0x30;
		afr_desc = afr_level.toString() 
	}
	var afr = {
		'key'   : afr_key,
		'field' : this.desc[afr_key]['field'],
		'value' : afr_value,
		'buffer': afr_buf,
		'hex'   : mBuffer.convBufferToHexString(afr_buf),
		'desc'  : afr_desc
	};
	structure.push(afr);

	var parsed = {
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
	var level = data['level'];
	if(typeof(level) !== 'number' || level < 0 || level > 8 || level % 1 > 0) {
		throw new Error('The "level" property in the 1st argument "data" is invalid.');
	}
	var level_value = 0x41;
	if(level > 0) {
		level_value = 0x30 + level;
	}
	var buf = Buffer.alloc(1);
	buf.writeUInt8(level_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
