/* ------------------------------------------------------------------
* node-echonet-lite - 03-B8-B2.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-06
*
* - Class group code : 03 : Housing/Facilities-related Device Class Group
* - Class code       : B8 : Combination microwave oven (electronic oven) class
* - EPC              : B2 : Heating setting
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'HS': {
				'field': 'Heating setting',
				'values': {
					0x41: 'Start/restart heating (heating started/restarted)',
					0x42: 'Suspend heating (heating suspended)',
					0x43: 'Stop heating (heating stopped)'
				}
			}
		},
		'ja': {
			'HS': {
				'field': '加熱設定',
				'values': {
					0x41: '加熱開始・再開',
					0x42: '加熱一時停止',
					0x43: '加熱停止'
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
	// Heating setting
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
			'action': hs_value - 0x40,
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
	let action = data['action'];
	if(typeof(action) !== 'number' || action < 1 || action > 3 || action % 1 > 0) {
		throw new Error('The "action" must be an integer in the range of 1 to 3.');
	}
	let action_value = 0x40 + action;
	let buf = Buffer.alloc(1);
	buf.writeUInt8(action_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
