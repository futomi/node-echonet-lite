/* ------------------------------------------------------------------
* node-echonet-lite - 01-35-E1.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 35 : Air cleaner class
* - EPC              : C1 : Smoke (cigarette) detection status
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'SMK': {
				'field': 'Smoke (cigarette) detection status',
				'values': {
					0x41: 'Smoke (cigarette) detection status found',
					0x42: 'Smoke (cigarette) detection status not found'
				}
			}
		},
		'ja': {
			'SMK': {
				'field': '煙(タバコ)検知状態',
				'values': {
					0x41: '煙(タバコ)検知有',
					0x42: '煙(タバコ)検知無'
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
	// Smoke (cigarette) detection status
	let smk_buf = buf.slice(0, 1);
	let smk_key = 'SMK';
	let smk_value = smk_buf.readUInt8(0);
	let smk = {
		'key'   : smk_key,
		'field' : this.desc[smk_key]['field'],
		'value' : smk_value,
		'buffer': smk_buf,
		'hex'   : mBuffer.convBufferToHexString(smk_buf),
		'desc'  : this.desc[smk_key]['values'][smk_value]
	};
	structure.push(smk);

	let parsed = {
		'message': {
			'smoke': (smk_value === 0x41) ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let smoke = data['smoke'];
	if(typeof(smoke) !== 'boolean') {
		throw new Error('The "smoke" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	var smoke_value = smoke ? 0x41 : 0x42;
	buf.writeUInt8(smoke_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
