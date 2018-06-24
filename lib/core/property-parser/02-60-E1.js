/* ------------------------------------------------------------------
* node-echonet-lite - 02-60-E1.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 60 : Electrically operated blind/shade class
* - EPC              : E1 : Degree-of-opening level
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'OLV': {
				'field': 'Degree-of-opening level',
				'values': {}
			}
		},
		'ja': {
			'OLV': {
				'field': '開度レベル設定',
				'values': {}
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
	// Operation time
	let olv_buf = buf.slice(0, 1);
	let olv_key = 'OLV';
	let olv_value = olv_buf.readUInt8(0);
	let olv = {
		'key'   : olv_key,
		'field' : this.desc[olv_key]['field'],
		'value' : olv_value,
		'buffer': olv_buf,
		'hex'   : mBuffer.convBufferToHexString(olv_buf),
		'desc'  : olv_value + ' %'
	};
	structure.push(olv);

	let parsed = {
		'message': {
			'level': olv_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let level = data['level'];
	if(typeof(level) !== 'number' || level < 0 || level > 100|| level % 1 > 0) {
		throw new Error('The "level" property in the 1st argument "data" is invalid.');
	}
	let buf = Buffer.alloc(1);
	buf.writeUInt8(level);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
