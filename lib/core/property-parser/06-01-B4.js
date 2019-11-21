/* ------------------------------------------------------------------
* node-echonet-lite - 06-01-B4.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-11-03
*
* - Class group code : 06 : Audiovisual-related Device Class Group
* - Class code       : 01 : Display class
* - EPC              : B4 : Length of character string accepted
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function () {
	this.lang = 'en';
	this.descs = {
		'en': {
			'LEN': {
				'field': 'Length of character string accepted',
				'values': {}
			}
		},
		'ja': {
			'LEN': {
				'field': '受付け伝達文字列長',
				'values': {}
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
	if (buf.length !== 2) {
		return null;
	}

	// Length of character string accepted
	let len_buf = buf.slice(0, 1);
	let len_key = 'LEN';
	let len_value = len_buf.readUInt8(0);
	let len = {
		'key': len_key,
		'field': this.desc[len_key]['field'],
		'value': len_value,
		'buffer': len_buf,
		'hex': mBuffer.convBufferToHexString(len_buf),
		'desc': len_value.toString()
	};
	structure.push(len);

	let parsed = {
		'message': {
			'length': len_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function (data) {
	if (typeof (data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let len = data['length'];
	if(typeof(len) !== 'number' || len % 1 !== 0 || len < 0 || len > 0xF4) {
		throw new Error('The "length" must be an integer in the range of 0 to 0xF4.');
	}

	let buf = Buffer.from([len, 0x00]);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
