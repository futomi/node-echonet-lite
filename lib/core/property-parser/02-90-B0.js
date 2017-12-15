/* ------------------------------------------------------------------
* node-echonet-lite - 02-90-B0.js
*
* Copyright (c) 2017, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2017-11-30
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 90 : General lighting class
* - EPC              : B0 : Illuminance level
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'LVL': {
				'field': 'Illuminance level',
				'values': {}
			}
		},
		'ja': {
			'LVL': {
				'field': '照度レベル設定',
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
	var structure = [];
	// Check the length of the buffer
	if(buf.length !== 1) {
		return null;
	}
	// Illuminance level
	var lvl_buf = buf.slice(0, 1);
	var lvl_key = 'LVL';
	var lvl_value = lvl_buf.readUInt8(0);
	var lvl = {
		'key'   : lvl_key,
		'field' : this.desc[lvl_key]['field'],
		'value' : lvl_value,
		'buffer': lvl_buf,
		'hex'   : mBuffer.convBufferToHexString(lvl_buf),
		'desc'  : lvl_value.toString() + ' %'
	};
	structure.push(lvl);

	var parsed = {
		'message': {
			'level': lvl_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument `data` must be an object.');
	}
	var level = data['level'];
	if(!('level' in data)) {
		throw new Error('The `level` is required.');
	}
	if(typeof(level) !== 'number' || level < 0 || level > 100 || level % 1 !== 0) {
		throw new Error('The `level` must be an integer between 0 and 100.');
	}
	var buf = Buffer.from([level]);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
