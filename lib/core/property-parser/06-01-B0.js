/* ------------------------------------------------------------------
* node-echonet-lite - 06-01-B0.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-30
*
* - Class group code : 06 : Audiovisual-related Device Class Group
* - Class code       : 01 : Display class
* - EPC              : B0 : Display control setting
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function () {
	this.lang = 'en';
	this.descs = {
		'en': {
			'DCS': {
				'field': 'Display control setting',
				'values': {
					0x30: 'Displaying enabled',
					0x31: 'Displaying disabled'
				}
			}
		},
		'ja': {
			'DCS': {
				'field': '表示制御設定',
				'values': {
					0x30: '表示',
					0x31: '非表示'
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
	// Display control setting
	let dcs_buf = buf.slice(0, 1);
	let dcs_key = 'DCS';
	let dcs_value = dcs_buf.readUInt8(0);
	let dcs_desc = this.desc[dcs_key]['values'][dcs_value] || '';
	let dcs = {
		'key': dcs_key,
		'field': this.desc[dcs_key]['field'],
		'value': dcs_value,
		'buffer': dcs_buf,
		'hex': mBuffer.convBufferToHexString(dcs_buf),
		'desc': dcs_desc
	};
	structure.push(dcs);

	let parsed = {
		'message': {
			'status': (dcs_value === 0x30) ? true : false,
			'desc': dcs_desc
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
