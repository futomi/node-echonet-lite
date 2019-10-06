/* ------------------------------------------------------------------
* node-echonet-lite - 03-B8-E2.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-06
*
* - Class group code : 03 : Housing/Facilities-related Device Class Group
* - Class code       : B8 : Combination microwave oven (electronic oven) class
* - EPC              : E2 : Automatic heating level setting
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'AHL': {
				'field': 'Automatic heating level setting',
				'values': {}
			}
		},
		'ja': {
			'AHL': {
				'field': '自動加熱レベル設定',
				'values': {}
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
	// Automatic heating level setting
	let ahl_buf = buf.slice(0, 1);
	let ahl_key = 'AHL';
	let ahl_value = ahl_buf.readUInt8(0);
	let ahl_v = ahl_value;
	if(ahl_v === 0xff) {
		ahl_v = null;
	} else {
		ahl_v = ahl_v - 0x30;
	}
	let ahl_desc = '';
	if(ahl_v === null) {
		if(this.lang === 'ja') {
			ahl_desc = '未設定';
		} else {
			ahl_desc = 'Not specified';
		}
	} else {
		ahl_desc = ahl_v.toString();
	}
	let ahl = {
		'key'   : ahl_key,
		'field' : this.desc[ahl_key]['field'],
		'value' : ahl_value,
		'buffer': ahl_buf,
		'hex'   : mBuffer.convBufferToHexString(ahl_buf),
		'desc'  : ahl_desc
	};
	structure.push(ahl);

	let parsed = {
		'message': {
			'level': ahl_v
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
	if(typeof(level) === 'number' && level % 1 === 0) {
		if(level >= 1 && level <= 5) {
			level = level + 0x30;
		} else {
			throw new Error('The "level" must be in the range of 1 to 5.');
		}
	} else if(level === null) {
		level = 0xff;
	} else {
		throw new Error('The "level" must be null or an integer.');
	}
	let buf = Buffer.alloc(1);
	buf.writeUInt8(level);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
