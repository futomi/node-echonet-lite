/* ------------------------------------------------------------------
* node-echonet-lite - 01-30-C4.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 30 : Home air conditioner class
* - EPC              : C4 : Degree of humidification setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'HUM': {
				'field': 'Degree of humidification setting',
				'values': {
					0x41: 'Automatic'
				}
			}
		},
		'ja': {
			'HUM': {
				'field': '加湿量設定',
				'values': {
					0x41: '自動'
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
	var hum_buf = buf.slice(0, 1);
	var hum_key = 'HUM';
	var hum_value = hum_buf.readUInt8(0);
	var hum_desc = '';
	var hum_level = 0;
	if(hum_value === 0x41) {
		hum_level = 0;
		hum_desc = this.desc[hum_key]['values'][hum_value];
	} else if(hum_value >= 0x31 && hum_value <= 0x38) {
		hum_level = hum_value - 0x30;
		hum_desc = hum_level.toString() 
	}
	var hum = {
		'key'   : hum_key,
		'field' : this.desc[hum_key]['field'],
		'value' : hum_value,
		'buffer': hum_buf,
		'hex'   : mBuffer.convBufferToHexString(hum_buf),
		'desc'  : hum_desc
	};
	structure.push(hum);

	var parsed = {
		'message': {
			'level': hum_level
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
	var level_value = (level === 0) ? 0x41 : (level + 0x30);
	var buf = Buffer.alloc(1);
	buf.writeInt8(level_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
