/* ------------------------------------------------------------------
* node-echonet-lite - 02-60-EA.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 60 : Electrically operated blind/shade class
* - EPC              : EA : Open/closed (extended/retracted) status
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'OCS': {
				'field': 'Open/closed (extended/retracted) status',
				'values': {
					0x41: 'Fully open',
					0x42: 'Fully closed',
					0x43: 'Open',
					0x44: 'Closed',
					0x45: 'Stopped halfway'
				}
			}
		},
		'ja': {
			'OCS': {
				'field': '開閉（張出し／収納）状態',
				'values': {
					0x41: '全開',
					0x42: '全閉',
					0x43: '開動作中',
					0x44: '閉動作中',
					0x45: '途中停止'
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
	// Selective opening (extension) operation setting
	let ocs_buf = buf.slice(0, 1);
	let ocs_key = 'OCS';
	let ocs_value = ocs_buf.readUInt8(0);
	let ocs = {
		'key'   : ocs_key,
		'field' : this.desc[ocs_key]['field'],
		'value' : ocs_value,
		'buffer': ocs_buf,
		'hex'   : mBuffer.convBufferToHexString(ocs_buf),
		'desc'  : this.desc[ocs_key]['values'][ocs_value]
	};
	structure.push(ocs);

	let parsed = {
		'message': {
			'status': ocs_value - 0x40
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let status = data['status'];
	if(typeof(status) !== 'number' || status < 1 || status > 5 || status % 1 > 0) {
		throw new Error('The "status" property in the 1st argument "data" is invalid.');
	}
	let status_value = 0x40 + status;
	let buf = Buffer.alloc(1);
	buf.writeUInt8(status_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
