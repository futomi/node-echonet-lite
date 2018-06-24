/* ------------------------------------------------------------------
* node-echonet-lite - 02-60-C2.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 60 : Electrically operated blind/shade class
* - EPC              : C2 : Wind detection status
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'WIN': {
				'field': 'Wind detection status',
				'values': {
					0x41: 'Wind',
					0x42: 'No wind'
				}
			}
		},
		'ja': {
			'WIN': {
				'field': '風検知状態',
				'values': {
					0x41: '風有',
					0x42: '風無'
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
	let structure = [];
	// Check the length of the buffer
	if(buf.length !== 1) {
		return null;
	}
	// Wind detection status
	let win_buf = buf.slice(0, 1);
	let win_key = 'WIN';
	let win_value = win_buf.readUInt8(0);
	let win = {
		'key'   : win_key,
		'field' : this.desc[win_key]['field'],
		'value' : win_value,
		'buffer': win_buf,
		'hex'   : mBuffer.convBufferToHexString(win_buf),
		'desc'  : this.desc[win_key]['values'][win_value]
	};
	structure.push(win);

	let parsed = {
		'message': {
			'wind': (win_value === 0x41) ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let wind = data['wind'];
	if(typeof(wind) !== 'boolean') {
		throw new Error('The "wind" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	var wind_value = wind ? 0x41 : 0x42;
	buf.writeUInt8(wind_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
