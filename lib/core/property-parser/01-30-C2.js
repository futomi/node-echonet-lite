/* ------------------------------------------------------------------
* node-echonet-lite - 01-30-C2.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-06
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 30 : Home air conditioner class
* - EPC              : C2 : Ventilation air flow rate setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'VAF': {
				'field': 'Ventilation air flow rate setting',
				'values': {
					0x41: 'Automatic control of ventilation air flow rate'
				}
			}
		},
		'ja': {
			'VAF': {
				'field': '換気風量設定',
				'values': {
					0x41: '換気風量自動'
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
	// Ventilation air flow rate setting
	var vaf_buf = buf.slice(0, 1);
	var vaf_key = 'VAF';
	var vaf_value = vaf_buf.readUInt8(0);
	var vaf_desc = '';
	var vaf_level = 0;
	if(vaf_value === 0x41) {
		vaf_level = 0;
		vaf_desc = this.desc[vaf_key]['values'][vaf_value];
	} else if(vaf_value >= 0x31 && vaf_value <= 0x38) {
		vaf_level = vaf_value - 0x30;
		vaf_desc = vaf_level.toString() 
	}
	var vaf = {
		'key'   : vaf_key,
		'field' : this.desc[vaf_key]['field'],
		'value' : vaf_value,
		'buffer': vaf_buf,
		'hex'   : mBuffer.convBufferToHexString(vaf_buf),
		'desc'  : vaf_desc
	};
	structure.push(vaf);

	var parsed = {
		'message': {
			'level': vaf_level
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
	var level_value = level === 0 ? 0x41 : level + 0x30;
	var buf = new Buffer(1);
	buf.writeInt8(level_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
