/* ------------------------------------------------------------------
* node-echonet-lite - 01-35-E1.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 35 : Air cleaner class
* - EPC              : C1 : Optical catalyst operation setting
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'CAT': {
				'field': 'Optical catalyst operation setting',
				'values': {
					0x41: 'Optical catalyst ON',
					0x42: 'Optical catalyst OFF'
				}
			}
		},
		'ja': {
			'CAT': {
				'field': '光触媒動作設定',
				'values': {
					0x41: '光触媒 ON',
					0x42: '光触媒 OFF'
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
	// Optical catalyst operation setting
	let cat_buf = buf.slice(0, 1);
	let cat_key = 'CAT';
	let cat_value = cat_buf.readUInt8(0);
	let cat = {
		'key'   : cat_key,
		'field' : this.desc[cat_key]['field'],
		'value' : cat_value,
		'buffer': cat_buf,
		'hex'   : mBuffer.convBufferToHexString(cat_buf),
		'desc'  : this.desc[cat_key]['values'][cat_value]
	};
	structure.push(cat);

	let parsed = {
		'message': {
			'catalyst': (cat_value === 0x41) ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let catalyst = data['catalyst'];
	if(typeof(catalyst) !== 'boolean') {
		throw new Error('The "catalyst" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	var catalyst_value = catalyst ? 0x41 : 0x42;
	buf.writeUInt8(catalyst_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
