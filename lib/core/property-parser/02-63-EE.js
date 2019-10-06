/* ------------------------------------------------------------------
* node-echonet-lite - 02-63-EE.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-05
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 63 : Electrically operated rain sliding door/shutter class
* - EPC              : EE : One-time opening speed setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'OTO': {
				'field': 'One-time opening speed setting',
				'values': {
					0x41: 'Low',
					0x42: 'Medium',
					0x43: 'High',
					0x44: 'None'
				}
			}
		},
		'ja': {
			'OTO': {
				'field': 'ワンタイム開速度設定',
				'values': {
					0x41: '低',
					0x42: '中',
					0x43: '高',
					0x44: '無し'
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
	// One-time opening speed setting
	var oto_buf = buf.slice(0, 1);
	var oto_key = 'OTO';
	var oto_value = oto_buf.readUInt8(0);
	var oto_desc = this.desc[oto_key]['values'][oto_value] || '';
	var oto = {
		'key'   : oto_key,
		'field' : this.desc[oto_key]['field'],
		'value' : oto_value,
		'buffer': oto_buf,
		'hex'   : mBuffer.convBufferToHexString(oto_buf),
		'desc'  : oto_desc
	};
	structure.push(oto);

	var parsed = {
		'message': {
			'speed': oto_value - 0x40,
			'desc': oto_desc
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
	if(!speed || typeof(speed) !== 'number' || speed % 1 !== 0 || speed < 1 || speed > 4) {
		throw new Error('The "speed" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	buf.writeUInt8(speed + 0x40);
	return buf;
};


module.exports = new EchonetLitePropertyParser();
