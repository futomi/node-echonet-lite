/* ------------------------------------------------------------------
* node-echonet-lite - 02-90-B5.js
*
* Copyright (c) 2017, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2017-11-30
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 90 : General lighting class
* - EPC              : B5 : Maximum value of settable level for night lighting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'ILM': {
				'field': 'Illuminance',
				'values': {}
			},
			'CLR': {
				'field': 'Color',
				'values': {}
			}
		},
		'ja': {
			'ILM': {
				'field': '照度',
				'values': {}
			},
			'CLR': {
				'field': '光色',
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
	if(buf.length !== 2) {
		return null;
	}
	// Illuminance
	var ilm_buf = buf.slice(0, 1);
	var ilm_key = 'ILM';
	var ilm_value = ilm_buf.readUInt8(0);
	var ilm = {
		'key'   : ilm_key,
		'field' : this.desc[ilm_key]['field'],
		'value' : ilm_value,
		'buffer': ilm_buf,
		'hex'   : mBuffer.convBufferToHexString(ilm_buf),
		'desc'  : ilm_value.toString()
	};
	structure.push(ilm);

	// Color
	var clr_buf = buf.slice(1, 2);
	var clr_key = 'CLR';
	var clr_value = clr_buf.readUInt8(0);
	var clr = {
		'key'   : clr_key,
		'field' : this.desc[clr_key]['field'],
		'value' : clr_value,
		'buffer': clr_buf,
		'hex'   : mBuffer.convBufferToHexString(clr_buf),
		'desc'  : clr_value.toString()
	};
	structure.push(clr);

	var parsed = {
		'message': {
			'illuminance': ilm_value,
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

	var ilm = data['illuminance'];
	if(!('illuminance' in data)) {
		throw new Error('The `illuminance` is required.');
	}
	if(typeof(ilm) !== 'number' || ilm < 0 || ilm > 255 || ilm % 1 !== 0) {
		throw new Error('The `illuminance` must be an integer between 0 and 255.');
	}

	var clr = data['color'];
	if(!('color' in data)) {
		throw new Error('The `color` is required.');
	}
	if(typeof(clr) !== 'number' || clr < 0 || clr > 255 || clr % 1 !== 0) {
		throw new Error('The `color` must be an integer between 0 and 255.');
	}

	var buf = Buffer.from([ilm, clr]);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
