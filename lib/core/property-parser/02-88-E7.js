/* ------------------------------------------------------------------
* node-echonet-lite - 02-88-E7.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 88 : Low voltage smart electric energy meter class
* - EPC              : E7 : Measured instantaneous electric energy
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'ENG': {
				'field': 'Energy',
				'values': {}
			}
		},
		'ja': {
			'ENG': {
				'field': '電力',
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
	if(buf.length !== 4) {
		return null;
	}
	// Energy
	var eng_buf = buf.slice(0, 4);
	var eng_key = 'ENG';
	var eng_value = eng_buf.readInt32BE(0);
	var eng = {
		'key'   : eng_key,
		'field' : this.desc[eng_key]['field'],
		'value' : eng_value,
		'buffer': eng_buf,
		'hex'   : mBuffer.convBufferToHexString(eng_buf),
		'desc'  : eng_value.toString() + ' W'
	};
	structure.push(eng);

	var parsed = {
		'message': {
			'energy': eng_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var energy = data['energy'];
	if(typeof(energy) !== 'number' || energy < -2147483647 || energy > 2147483645 || energy % 1 > 0) {
		throw new Error('The "energy" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(4);
	buf.writeInt32BE(energy);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
