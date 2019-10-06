/* ------------------------------------------------------------------
* node-echonet-lite - 02-63-D1.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-05
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 63 : Electrically operated rain sliding door/shutter class
* - EPC              : D1 : Closing speed setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'CS': {
				'field': 'Closing speed setting',
				'values': {
					0x41: 'Low',
					0x42: 'Medium',
					0x43: 'High'
				}
			}
		},
		'ja': {
			'CS': {
				'field': '閉速度設定',
				'values': {
					0x41: '低',
					0x42: '中',
					0x43: '高'
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
	// Closing speed setting
	var cs_buf = buf.slice(0, 1);
	var cs_key = 'CS';
	var cs_value = cs_buf.readUInt8(0);
	var cs_desc = this.desc[cs_key]['values'][cs_value] || '';
	var cs = {
		'key'   : cs_key,
		'field' : this.desc[cs_key]['field'],
		'value' : cs_value,
		'buffer': cs_buf,
		'hex'   : mBuffer.convBufferToHexString(cs_buf),
		'desc'  : cs_desc
	};
	structure.push(cs);

	var parsed = {
		'message': {
			'speed': cs_value - 0x40,
			'desc': cs_desc
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var speed = data['speed'];
	if(!speed || typeof(speed) !== 'number' || !(speed === 1 || speed === 2 || speed === 3)) {
		throw new Error('The "code" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	buf.writeUInt8(speed + 0x40);
	return buf;
};


module.exports = new EchonetLitePropertyParser();
