/* ------------------------------------------------------------------
* node-echonet-lite - 00-22-E1.js
*
* Copyright (c) 2017-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 00 : Sensor-related Device Class Group
* - Class code       : 22 : Electric energy sensor class
* - EPC              : E1 : Medium-capacity sensor instantaneous electric energy
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'ENG': {
				'field': 'Medium-capacity sensor instantaneous electric energy',
				'values': {}
			}
		},
		'ja': {
			'ENG': {
				'field': '中容量センサ瞬時電力値計測値',
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
	var eng_value = eng_buf.readInt32BE(0); // W
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
	if(typeof(energy) !== 'number' || energy < -999999999 || energy > 999999999 || energy % 1 > 0) {
		throw new Error('The `energy` must be an integer between -999999999 and 999999999.');
	}
	var buf = Buffer.alloc(4);
	buf.writeInt32BE(energy);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
