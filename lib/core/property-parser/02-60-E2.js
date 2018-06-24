/* ------------------------------------------------------------------
* node-echonet-lite - 02-60-E2.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 60 : Electrically operated blind/shade class
* - EPC              : E2 : Shade angle setting
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'SHA': {
				'field': 'Shade angle setting',
				'values': {}
			}
		},
		'ja': {
			'SHA': {
				'field': 'ブラインド角度',
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
	// Shade angle setting
	let sha_buf = buf.slice(0, 1);
	let sha_key = 'SHA';
	let sha_value = sha_buf.readUInt8(0);
	let sha = {
		'key'   : sha_key,
		'field' : this.desc[sha_key]['field'],
		'value' : sha_value,
		'buffer': sha_buf,
		'hex'   : mBuffer.convBufferToHexString(sha_buf),
		'desc'  : sha_value + ' deg'
	};
	structure.push(sha);

	let parsed = {
		'message': {
			'angle': sha_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let angle = data['angle'];
	if(typeof(angle) !== 'number' || angle < 0 || angle > 180|| angle % 1 > 0) {
		throw new Error('The "angle" property in the 1st argument "data" is invalid.');
	}
	let buf = Buffer.alloc(1);
	buf.writeUInt8(angle);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
