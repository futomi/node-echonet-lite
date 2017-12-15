/* ------------------------------------------------------------------
* node-echonet-lite - 05-FF-CC.js
*
* Copyright (c) 2017, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2017-11-30
*
* - Class group code : 05 : Management/Operation-related Device Class Group
* - Class code       : FF : Controller
* - EPC              : CC : Place to install device to be controlled
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'LOC': {
				'field': 'Place to install device to be controlled',
				'values': {
					0b00001: 'Living room',
					0b00010: 'Dining room',
					0b00011: 'Kitchen',
					0b00100: 'Bathroom',
					0b00101: 'Lavatory',
					0b00110: 'Washroom/changing room',
					0b00111: 'Passageway',
					0b01000: 'Room',
					0b01001: 'Stairway',
					0b01010: 'Front door',
					0b01011: 'Storeroom',
					0b01100: 'Garden/perimeter',
					0b01101: 'Garage',
					0b01110: 'Veranda/balcony',
					0b01111: 'Others'
				}
			}
		},
		'ja': {
			'LOC': {
				'field': '管理対象機器設置場所',
				'values': {
					0b00001: '居間、リビング',
					0b00010: '食堂、ダイニング',
					0b00011: '台所、キッチン',
					0b00100: '浴室、バス',
					0b00101: 'トイレ',
					0b00110: '洗面所、脱衣所',
					0b00111: '廊下',
					0b01000: '部屋',
					0b01001: '階段',
					0b01010: '玄関',
					0b01011: '納戸',
					0b01100: '庭、外周',
					0b01101: '車庫',
					0b01110: 'ベランダ、バルコニー',
					0b01111: 'その他'
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
	// Installation location
	var loc_buf = buf.slice(0, 1);
	var loc_key = 'LOC';
	var loc_value = loc_buf.readUInt8(0);
	var loc_desc = this.desc[loc_key]['values'][loc_value >> 3];
	var loc = {
		'key'   : loc_key,
		'field' : this.desc[loc_key]['field'],
		'value' : loc_value,
		'buffer': loc_buf,
		'hex'   : mBuffer.convBufferToHexString(loc_buf),
		'desc'  : loc_desc
	};
	structure.push(loc);

	var parsed = {
		'message': {
			'code': loc_value,
			'desc': loc_desc
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument `data` must be an object.');
	}
	var code = data['code'];
	if(!('code' in data)) {
		throw new Error('The `code` is required.');
	} else if(typeof(code) !== 'number' || code % 1 !== 0 || code < 0 || code > 15) {
		throw new Error('The `code` must be an integer between 1 and 15.');
	}

	code = code << 3;
	var buf = Buffer.from([code]);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
