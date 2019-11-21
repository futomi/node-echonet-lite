/* ------------------------------------------------------------------
* node-echonet-lite - 00-02-B1.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-30
*
* - Class group code : 00 : Sensor-related Device Class Group
* - Class code       : 02 : Crime prevention sensor class
* - EPC              : B1 : Invasion occurrence status
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function () {
	this.lang = 'en';
	this.descs = {
		'en': {
			'IOS': {
				'field': 'Invasion occurrence status',
				'values': {
					0x41: 'Invasion occurrence status found',
					0x42: 'Invasion occurrence status not found'
				}
			}
		},
		'ja': {
			'IOS': {
				'field': '侵入発生状態',
				'values': {
					0x41: '侵入発生有',
					0x42: '侵入発生無'
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
	// Invasion occurrence status
	let ios_buf = buf.slice(0, 1);
	let ios_key = 'IOS';
	let ios_value = ios_buf.readUInt8(0);
	let ios_desc = this.desc[ios_key]['values'][ios_value] || '';
	let ios = {
		'key': ios_key,
		'field': this.desc[ios_key]['field'],
		'value': ios_value,
		'buffer': ios_buf,
		'hex': mBuffer.convBufferToHexString(ios_buf),
		'desc': ios_desc
	};
	structure.push(ios);

	let parsed = {
		'message': {
			'status': (ios_value === 0x41) ? true : false,
			'desc': ios_desc
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
		throw new Error('The "status" property in the 1st argument "data" is invalid.');
	}
	let buf = Buffer.alloc(1);
	let status_value = status ? 0x41 : 0x42;
	buf.writeUInt8(status_value);
	return buf;
};


module.exports = new EchonetLitePropertyParser();
