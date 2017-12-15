/* ------------------------------------------------------------------
* node-echonet-lite - 02-90-BD.js
*
* Copyright (c) 2017, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2017-12-01
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 90 : General lighting class
* - EPC              : BD : Light color setting for night lighting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'CLR': {
				'field': 'Light color setting for night lighting',
				'values': {
					0x40: 'Other',
					0x41: 'Incandescent lamp color',
					0x42: 'White',
					0x43: 'Daylight white',
					0x44: 'Daylight color'
				}
			}
		},
		'ja': {
			'CLR': {
				'field': '常夜灯モード時光色設定',
				'values': {
					0x40: 'その他',
					0x41: '電球色',
					0x42: '白色',
					0x43: '昼白色',
					0x44: '昼光色'
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
	// Light color setting
	var clr_buf = buf.slice(0, 1);
	var clr_key = 'CLR';
	var clr_value = clr_buf.readUInt8(0);
	var clr = {
		'key'   : clr_key,
		'field' : this.desc[clr_key]['field'],
		'value' : clr_value,
		'buffer': clr_buf,
		'hex'   : mBuffer.convBufferToHexString(clr_buf),
		'desc'  : this.desc[clr_key]['values'][clr_value]
	};
	structure.push(clr);

	var parsed = {
		'message': {
			'color': clr_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument `data` must be an object.');
	}
	var color = data['color'];
	if(!('color' in data)) {
		throw new Error('The `color` is required.');
	} else if(typeof(color) !== 'number') {
		throw new Error('The `color` must be a number.');
	} else if(!(color === 0x40 || color === 0x41 || color === 0x42 || color === 0x43 || color === 0x44)) {
		throw new Error('The `color` must be 0x40, 0x41, 0x42, 0x43, or 0x44.');
	}
	var buf = Buffer.from([color]);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
