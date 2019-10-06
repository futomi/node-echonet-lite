/* ------------------------------------------------------------------
* node-echonet-lite - 03-B8-B1.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-06
*
* - Class group code : 03 : Housing/Facilities-related Device Class Group
* - Class code       : B8 : Combination microwave oven (electronic oven) class
* - EPC              : B1 : Heating status
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'HS': {
				'field': 'Heating status',
				'values': {
					0x40: 'Initial state',
					0x41: 'Heating',
					0x42: 'Heating suspended',
					0x43: 'Reporting completion of heating cycle',
					0x44: 'Setting',
					0x45: 'Preheating',
					0x46: 'Preheat temperature maintenance',
					0x47: 'Heating temporarily stopped for manual cooking action'
				}
			}
		},
		'ja': {
			'HS': {
				'field': '加熱状態',
				'values': {
					0x40: '初期状態',
					0x41: '運転中',
					0x42: '一時停止中',
					0x43: '完了報知中',
					0x44: '設定中',
					0x45: '予熱中',
					0x46: '予熱完了保温中',
					0x47: '加熱途中報知一時停止中'
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
	// Heating status
	let hs_buf = buf.slice(0, 1);
	let hs_key = 'HS';
	let hs_value = hs_buf.readUInt8(0);
	let hs_desc = this.desc[hs_key]['values'][hs_value];
	let hs = {
		'key'   : hs_key,
		'field' : this.desc[hs_key]['field'],
		'value' : hs_value,
		'buffer': hs_buf,
		'hex'   : mBuffer.convBufferToHexString(hs_buf),
		'desc'  : hs_desc
	};
	structure.push(hs);

	let parsed = {
		'message': {
			'status': hs_value - 0x40,
			'desc': hs_desc
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
	if(typeof(status) !== 'number' || status < 0 || status > 7 || status % 1 > 0) {
		throw new Error('The "status" must be an integer in the range of 0 to 7.');
	}
	let status_value = 0x40 + status;
	let buf = Buffer.alloc(1);
	buf.writeUInt8(status_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
