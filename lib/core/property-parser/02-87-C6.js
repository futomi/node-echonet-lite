/* ------------------------------------------------------------------
* node-echonet-lite - 02-88-C6.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-05
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 87 : Power distribution board metering class
* - EPC              : C6 : Measured instantaneous amount of electric energy
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'MIA': {
				'field': 'Measured instantaneous amount of electric energy',
				'values': {}
			}
		},
		'ja': {
			'MIA': {
				'field': '瞬時電力計測値',
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
	// Measured instantaneous amount of electric energy
	var mia_buf = buf.slice(0, 4);
	var mia_key = 'MIA';
	var mia_value = mia_buf.readInt32BE(0);
	var mia = {
		'key'   : mia_key,
		'field' : this.desc[mia_key]['field'],
		'value' : mia_value,
		'buffer': mia_buf,
		'hex'   : mBuffer.convBufferToHexString(mia_buf),
		'desc'  : mia_value.toString() + ' W'
	};
	structure.push(mia);

	var parsed = {
		'message': {
			'energy': mia_value
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
