/* ------------------------------------------------------------------
* node-echonet-lite - 00-08-B1.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-30
*
* - Class group code : 00 : Sensor-related Device Class Group
* - Class code       : 08 : Visitor sensor class
* - EPC              : B1 : Visitor detection status
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function () {
	this.lang = 'en';
	this.descs = {
		'en': {
			'VDS': {
				'field': 'Visitor detection status',
				'values': {
					0x41: 'Visitor detection status found',
					0x42: 'Visitor detection status not found'
				}
			}
		},
		'ja': {
			'VDS': {
				'field': '来客検知状態',
				'values': {
					0x41: '来客検知有',
					0x42: '来客検知無'
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
	// isitor detection status
	let vds_buf = buf.slice(0, 1);
	let vds_key = 'VDS';
	let vds_value = vds_buf.readUInt8(0);
	let vds_desc = this.desc[vds_key]['values'][vds_value] || '';
	let vds = {
		'key': vds_key,
		'field': this.desc[vds_key]['field'],
		'value': vds_value,
		'buffer': vds_buf,
		'hex': mBuffer.convBufferToHexString(vds_buf),
		'desc': vds_desc
	};
	structure.push(vds);

	let parsed = {
		'message': {
			'status': (vds_value === 0x41) ? true : false,
			'desc': vds_desc
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
