/* ------------------------------------------------------------------
* node-echonet-lite - 02-63-E5.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-02
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 63 : Electrically operated rain sliding door/shutter class
* - EPC              : E5 : Electric lock setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'ELS': {
				'field': 'Electric lock setting',
				'values': {
					0x41: 'Lock',
					0x42: 'Unlock'
				}
			}
		},
		'ja': {
			'ELS': {
				'field': '電気錠設定',
				'values': {
					0x41: '施錠',
					0x42: '開錠'
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
	// Electric lock setting
	var els_buf = buf.slice(0, 1);
	var els_key = 'ELS';
	var els_value = els_buf.readUInt8(0);
	var els = {
		'key'   : els_key,
		'field' : this.desc[els_key]['field'],
		'value' : els_value,
		'buffer': els_buf,
		'hex'   : mBuffer.convBufferToHexString(els_buf),
		'desc'  : this.desc[els_key]['values'][els_value]
	};
	structure.push(els);

	var parsed = {
		'message': {
			'lock': (els_value === 0x41) ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var lock = data['lock'];
	if(typeof(lock) !== 'boolean') {
		throw new Error('The "lock" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	var lock_value = lock ? 0x41 : 0x42;
	buf.writeUInt8(lock_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
