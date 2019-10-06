/* ------------------------------------------------------------------
* node-echonet-lite - 02-63-90.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-02
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 63 : Electrically operated rain sliding door/shutter class
* - EPC              : 90 : Timer operation setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'TOS': {
				'field': 'Timer operation setting',
				'values': {
					0x41: 'ON',
					0x42: 'OFF'
				}
			}
		},
		'ja': {
			'TOS': {
				'field': 'タイマ動作設定',
				'values': {
					0x41: 'ON',
					0x42: 'OFF'
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
	// Timer operation setting
	var tos_buf = buf.slice(0, 1);
	var tos_key = 'TOS';
	var tos_value = tos_buf.readUInt8(0);
	var tos = {
		'key'   : tos_key,
		'field' : this.desc[tos_key]['field'],
		'value' : tos_value,
		'buffer': tos_buf,
		'hex'   : mBuffer.convBufferToHexString(tos_buf),
		'desc'  : this.desc[tos_key]['values'][tos_value]
	};
	structure.push(tos);

	var parsed = {
		'message': {
			'status': (tos_value === 0x41) ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var status = data['status'];
	if(typeof(status) !== 'boolean') {
		throw new Error('The "status" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	var status_value = status ? 0x41 : 0x42;
	buf.writeUInt8(status_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
