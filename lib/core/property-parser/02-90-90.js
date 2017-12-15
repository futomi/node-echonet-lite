/* ------------------------------------------------------------------
* node-echonet-lite - 02-90-90.js
*
* Copyright (c) 2017, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2017-12-01
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 90 : General lighting class
* - EPC              : 90 : ON timer reservation setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'SET': {
				'field': 'ON timer reservation setting',
				'values': {
					0x41: 'ON',
					0x42: 'OFF'
				}
			}
		},
		'ja': {
			'SET': {
				'field': 'ON タイマ予約設定',
				'values': {
					0x41: '予約入',
					0x42: '予約切'
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
	// ON timer reservation setting
	var set_buf = buf.slice(0, 1);
	var set_key = 'SET';
	var set_value = set_buf.readUInt8(0);
	var set = {
		'key'   : set_key,
		'field' : this.desc[set_key]['field'],
		'value' : set_value,
		'buffer': set_buf,
		'hex'   : mBuffer.convBufferToHexString(set_buf),
		'desc'  : this.desc[set_key]['values'][set_value]
	};
	structure.push(set);

	var parsed = {
		'message': {
			'set': (set_value === 0x41) ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var set = data['set'];
	if(!('set' in data)) {
		throw new Error('The `set` is required.');
	} else if(typeof(set) !== 'boolean') {
		throw new Error('The `set` must be a boolean.');
	}
	var buf = new Buffer(1);
	var set_value = set ? 0x41 : 0x42;
	buf.writeUInt8(set_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
