/* ------------------------------------------------------------------
* node-echonet-lite - 03-B8-E1.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-06
*
* - Class group code : 03 : Housing/Facilities-related Device Class Group
* - Class code       : B8 : Combination microwave oven (electronic oven) class
* - EPC              : E1 : Automatic heating setting
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'AHS': {
				'field': 'Automatic heating setting',
				'values': {
					0x41: 'Automatic',
					0x42: 'Manual',
					0xFF: 'Not specified'
				}
			}
		},
		'ja': {
			'AHS': {
				'field': '自動加熱設定',
				'values': {
					0x41: '自動',
					0x42: 'マニュアル',
					0xFF: '未設定'
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
	// Automatic heating setting
	let ahs_buf = buf.slice(0, 1);
	let ahs_key = 'AHS';
	let ahs_value = ahs_buf.readUInt8(0);
	let ahs_v = ahs_value;
	if(ahs_v === 0xff) {
		ahs_v = null;
	} else {
		ahs_v = ahs_v - 0x40;
	}
	let ahs_desc = this.desc[ahs_key]['values'][ahs_value];
	let ahs = {
		'key'   : ahs_key,
		'field' : this.desc[ahs_key]['field'],
		'value' : ahs_value,
		'buffer': ahs_buf,
		'hex'   : mBuffer.convBufferToHexString(ahs_buf),
		'desc'  : ahs_desc
	};
	structure.push(ahs);

	let parsed = {
		'message': {
			'mode': ahs_v,
			'desc': ahs_desc
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let mode = data['mode'];
	if(typeof(mode) === 'number' && mode % 1 === 0) {
		if((mode >= 1 && mode <= 8) || mode === 17) {
			mode += 0x40;
		} else {
			throw new Error('The "mode" must be 1...8 or 17.');
		}
	} else if(mode === null) {
		mode = 0xff;
	} else {
		throw new Error('The "mode" must be null or an integer.');
	}
	let buf = Buffer.alloc(1);
	buf.writeUInt8(mode);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
