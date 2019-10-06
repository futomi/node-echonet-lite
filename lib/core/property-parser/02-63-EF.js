/* ------------------------------------------------------------------
* node-echonet-lite - 02-63-EF.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-05
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 63 : Electrically operated rain sliding door/shutter class
* - EPC              : EF : One-time closing speed setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'OTC': {
				'field': 'One-time closing speed setting',
				'values': {
					0x41: 'Low',
					0x42: 'Medium',
					0x43: 'High',
					0x44: 'None'
				}
			}
		},
		'ja': {
			'OTC': {
				'field': 'ワンタイム閉速度設定',
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
	// One-time closing speed setting
	var otc_buf = buf.slice(0, 1);
	var otc_key = 'OTC';
	var otc_value = otc_buf.readUInt8(0);
	var otc_desc = this.desc[otc_key]['values'][otc_value] || '';
	var otc = {
		'key'   : otc_key,
		'field' : this.desc[otc_key]['field'],
		'value' : otc_value,
		'buffer': otc_buf,
		'hex'   : mBuffer.convBufferToHexString(otc_buf),
		'desc'  : otc_desc
	};
	structure.push(otc);

	var parsed = {
		'message': {
			'speed': otc_value - 0x40,
			'desc': otc_desc
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
