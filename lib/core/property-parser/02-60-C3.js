/* ------------------------------------------------------------------
* node-echonet-lite - 02-60-C3.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 60 : Electrically operated blind/shade class
* - EPC              : C3 : Sunlight detection status
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'SUN': {
				'field': 'Sunlight detection status',
				'values': {
					0x41: 'Sunlight',
					0x42: 'No sunlight'
				}
			}
		},
		'ja': {
			'SUN': {
				'field': '日差し検知状態',
				'values': {
					0x41: '日差し有',
					0x42: '日差し無'
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
	let sun_buf = buf.slice(0, 1);
	let sun_key = 'SUN';
	let sun_value = sun_buf.readUInt8(0);
	let sun = {
		'key'   : sun_key,
		'field' : this.desc[sun_key]['field'],
		'value' : sun_value,
		'buffer': sun_buf,
		'hex'   : mBuffer.convBufferToHexString(sun_buf),
		'desc'  : this.desc[sun_key]['values'][sun_value]
	};
	structure.push(sun);

	let parsed = {
		'message': {
			'sunlight': (sun_value === 0x41) ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let sunlight = data['sunlight'];
	if(typeof(sunlight) !== 'boolean') {
		throw new Error('The "sunlight" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	var sunlight_value = sunlight ? 0x41 : 0x42;
	buf.writeUInt8(sunlight_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
