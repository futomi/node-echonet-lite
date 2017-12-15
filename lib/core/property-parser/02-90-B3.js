/* ------------------------------------------------------------------
* node-echonet-lite - 02-90-B3.js
*
* Copyright (c) 2017, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2017-11-30
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 90 : General lighting class
* - EPC              : B3 : Light color step setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'STP': {
				'field': 'Light color step setting',
				'values': {}
			}
		},
		'ja': {
			'STP': {
				'field': '光色レベル段数設定',
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
	// Light color step setting'
	var stp_buf = buf.slice(0, 1);
	var stp_key = 'STP';
	var stp_value = stp_buf.readUInt8(0);
	var stp = {
		'key'   : stp_key,
		'field' : this.desc[stp_key]['field'],
		'value' : stp_value,
		'buffer': stp_buf,
		'hex'   : mBuffer.convBufferToHexString(stp_buf),
		'desc'  : stp_value.toString()
	};
	structure.push(stp);

	var parsed = {
		'message': {
			'step': stp_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument `data` must be an object.');
	}
	var step = data['step'];
	if(!('step' in data)) {
		throw new Error('The `step` is required.');
	}
	if(typeof(step) !== 'number' || step < 1 || step > 255 || step % 1 !== 0) {
		throw new Error('The `step` must be an integer between 1 and 255.');
	}
	var buf = Buffer.from([step]);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
