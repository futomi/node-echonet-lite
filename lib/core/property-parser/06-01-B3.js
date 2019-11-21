/* ------------------------------------------------------------------
* node-echonet-lite - 06-01-B3.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-11-09
*
* - Class group code : 06 : Audiovisual-related Device Class Group
* - Class code       : 01 : Display class
* - EPC              : B3 : Character string to present to the user
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function () {
	this.lang = 'en';
	this.descs = {
		'en': {
			'LEN': {
				'field': 'Byte code sequence data length of the character string',
				'values': {}
			},
			'CCD': {
				'field': 'Character code',
				'values': {
					0x01: 'ascii',
					0x02: 'shift_jis',
					0x03: 'jis',
					0x04: 'euc-jp',
					0x05: 'ucs-4',
					0x06: 'ucs-2',
					0x07: 'latin-1',
					0x08: 'utf-8'
				}
			},
			'BCS': {
				'field': 'Byte code sequence of the character string',
				'values': {}
			}
		},
		'ja': {
			'LEN': {
				'field': '伝達文字バイトコード列データ長',
				'values': {}
			},
			'CCD': {
				'field': 'Character code',
				'values': {
					0x01: 'ascii',
					0x02: 'shift_jis',
					0x03: 'jis',
					0x04: 'euc-jp',
					0x05: 'ucs-4',
					0x06: 'ucs-2',
					0x07: 'latin-1',
					0x08: 'utf-8'
				}
			},
			'BCS': {
				'field': '伝達文字列バイトコード列',
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
	if (buf.length < 4 || buf.length > 247) {
		return null;
	}

	// Byte code sequence data length of the character string
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

	// Character code
	let ccd_buf = buf.slice(1, 2);
	let ccd_key = 'CCD';
	let ccd_value = ccd_buf.readUInt8(0);
	let ccd_desc = this.desc[ccd_key]['values'][ccd_value] || '';
	let ccd = {
		'key': ccd_key,
		'field': this.desc[ccd_key]['field'],
		'value': ccd_value,
		'buffer': ccd_buf,
		'hex': mBuffer.convBufferToHexString(ccd_buf),
		'desc': ccd_desc
	};
	structure.push(ccd);

	// Byte code sequence of the character string
	let bcs_buf = buf.slice(3);
	let bcs_key = 'BCS';
	let bcs_desc = bcs_buf.toString('utf8');
	let bcs = {
		'key': bcs_key,
		'field': this.desc[bcs_key]['field'],
		'buffer': bcs_buf,
		'hex': mBuffer.convBufferToHexString(bcs_buf),
		'desc': bcs_desc
	};
	structure.push(bcs);

	let parsed = {
		'message': {
			'length': len_value,
			'code': ccd_desc,
			'string': bcs_desc
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function (data) {
	if (typeof (data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let string = data['string'];
	if(typeof(string) !== 'string') {
		throw new Error('The "string" must be a string.');
	}

	let buf2 = Buffer.from(string, 'utf8');
	let buf1 = Buffer.from([buf2.length, 0x08, 0x00]);
	let buf = Buffer.concat([buf1, buf2]);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
