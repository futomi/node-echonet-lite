/* ------------------------------------------------------------------
* node-echonet-lite - 00-02-B0.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-30
*
* - Class group code : 00 : Sensor-related Device Class Group
* - Class code       : 02 : Crime prevention sensor class
* - EPC              : B0 : Detection threshold level
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'DTL': {
				'field': 'Detection threshold level',
				'values': {}
			}
		},
		'ja': {
			'DTL': {
				'field': '検知閾値レベル設定',
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
	// Detection threshold level
	let dtl_buf = buf.slice(0, 1);
	let dtl_key = 'DTL';
	let dtl_value = dtl_buf.readUInt8(0);
	let dtl_level = dtl_value - 0x30;
	let dtl_desc = dtl_level.toString() 
	let dtl = {
		'key'   : dtl_key,
		'field' : this.desc[dtl_key]['field'],
		'value' : dtl_value,
		'buffer': dtl_buf,
		'hex'   : mBuffer.convBufferToHexString(dtl_buf),
		'desc'  : dtl_desc
	};
	structure.push(dtl);

	let parsed = {
		'message': {
			'level': dtl_level
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
	if(typeof(level) !== 'number' || level < 1 || level > 8 || level % 1 > 0) {
		throw new Error('The "level" must be an integer in the range of 1 to 8.');
	}
	let buf = Buffer.alloc(1);
	buf.writeUInt8(level + 0x30);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
