/* ------------------------------------------------------------------
* node-echonet-lite - 00-22-E0.js
*
* Copyright (c) 2017-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 00 : Sensor-related Device Class Group
* - Class code       : 22 : Electric energy sensor class
* - EPC              : E0 : Cumulative amounts of electric energy
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'ENG': {
				'field': 'Cumulative amounts of electric energy',
				'values': {}
			}
		},
		'ja': {
			'ENG': {
				'field': '積算電力量計測値',
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
	var eng_value = eng_buf.readUInt32BE(0); // Wh
	var eng = {
		'key'   : eng_key,
		'field' : this.desc[eng_key]['field'],
		'value' : eng_value,
		'buffer': eng_buf,
		'hex'   : mBuffer.convBufferToHexString(eng_buf),
		'desc'  : eng_value.toString()
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
		throw new Error('The 1st argument `data` must be an object.');
	}
	var energy = data['energy'];
	if(typeof(energy) !== 'number' || energy < 0 || energy > 999999999 || energy % 1 > 0) {
		throw new Error('The `energy` must be an integer between 0 and 999999999.');
	}
	var buf = Buffer.alloc(4);
	buf.writeUInt32BE(energy);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
