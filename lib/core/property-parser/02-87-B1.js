/* ------------------------------------------------------------------
* node-echonet-lite - 02-87-B1.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-05
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 87 : Power distribution board metering class
* - EPC              : B1 : Number of measurement channels (simplex)
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'NMC': {
				'field': 'Number of measurement channels (simplex)',
				'values': {}
			}
		},
		'ja': {
			'NMC': {
				'field': '計測チャンネル数（片方向）',
				'values': {}
			}
		},
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
	// Number of measurement channels (simplex)
	var nmc_buf = buf.slice(0, 1);
	var nmc_key = 'NMC';
	var nmc_value = nmc_buf.readUInt8(0);
	var nmc_v = nmc_value;
	if(nmc_v === 0xFD) {
		nmc_v = null;
	}
	var nmc_desc = '';
	if(nmc_v === null) {
		if(this.lang === 'ja') {
			nmc_desc = '不明';
		} else {
			nmc_desc = 'Unknown';
		}
	} else {
		nmc_desc = nmc_v.toString();
	}
	var nmc = {
		'key'   : nmc_key,
		'field' : this.desc[nmc_key]['field'],
		'value' : nmc_value,
		'buffer': nmc_buf,
		'hex'   : mBuffer.convBufferToHexString(nmc_buf),
		'desc'  : nmc_desc
	};
	structure.push(nmc);

	var parsed = {
		'message': {
			'number': nmc_v
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var number = data['number'];
	if(typeof(number) === 'number') {
		if(number >= 1 && number <= 252 && number % 1 === 0) {

		} else {
			throw new Error('The "number" must be an integer in the range of 1 to 252.');
		}
	} else if(number === null) {
		number = 0xFD;
	} else {
		throw new Error('The "number" must be null or an integer.');
	}

	var buf = Buffer.alloc(1);
	buf.writeUInt8(number);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
