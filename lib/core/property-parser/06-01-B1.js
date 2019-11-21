/* ------------------------------------------------------------------
* node-echonet-lite - 06-01-B1.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-31
*
* - Class group code : 06 : Audiovisual-related Device Class Group
* - Class code       : 01 : Display class
* - EPC              : B1 : Character string setting acceptance status
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function () {
	this.lang = 'en';
	this.descs = {
		'en': {
			'CAS': {
				'field': 'Character string setting acceptance status',
				'values': {
					0x30: 'Ready',
					0x31: 'Busy'
				}
			}
		},
		'ja': {
			'CAS': {
				'field': '文字列設定受付可能状態',
				'values': {
					0x30: 'レディ',
					0x31: 'ビジー'
				}
			}
		}
	}
	this.desc = this.descs[this.lang];
};

EchonetLitePropertyParser.prototype.setLang = function (lang) {
	if (this.descs[lang]) {
		this.desc = this.descs[lang];
		this.lang = lang;
	}
	return this.lang;
};

EchonetLitePropertyParser.prototype.parse = function (buf) {
	let structure = [];
	// Check the length of the buffer
	if (buf.length !== 1) {
		return null;
	}
	// Character string setting acceptance status
	let cas_buf = buf.slice(0, 1);
	let cas_key = 'CAS';
	let cas_value = cas_buf.readUInt8(0);
	let cas_desc = this.desc[cas_key]['values'][cas_value] || '';
	let cas = {
		'key': cas_key,
		'field': this.desc[cas_key]['field'],
		'value': cas_value,
		'buffer': cas_buf,
		'hex': mBuffer.convBufferToHexString(cas_buf),
		'desc': cas_desc
	};
	structure.push(cas);

	let parsed = {
		'message': {
			'status': (cas_value === 0x30) ? true : false,
			'desc': cas_desc
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function (data) {
	if (typeof (data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let status = data['status'];
	if (typeof (status) !== 'boolean') {
		throw new Error('The "status" must be boolean.');
	}
	let buf = Buffer.alloc(1);
	let status_value = status ? 0x30 : 0x31;
	buf.writeUInt8(status_value);
	return buf;
};


module.exports = new EchonetLitePropertyParser();
