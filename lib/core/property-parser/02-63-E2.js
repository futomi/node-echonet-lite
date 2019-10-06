/* ------------------------------------------------------------------
* node-echonet-lite - 02-63-E2.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-02
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 63 : Electrically operated rain sliding door/shutter class
* - EPC              : E2 : Blind angle setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'BAS': {
				'field': 'Blind angle setting',
				'values': {}
			}
		},
		'ja': {
			'BAS': {
				'field': 'ブラインド角度設定値',
				'values': {}
			}
		},
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
	var structure = [];
	// Check the length of the buffer
	if(buf.length !== 1) {
		return null;
	}
	// Blind angle setting
	var bas_buf = buf.slice(0, 1);
	var bas_key = 'BAS';
	var bas_value = bas_buf.readUInt8(0);
	var bas_desc = bas_value.toString();
	if(this.lang === 'ja') {
		bas_desc += ' 度';
	} else {
		bas_desc += ' deg';
	}
	var bas = {
		'key'   : bas_key,
		'field' : this.desc[bas_key]['field'],
		'value' : bas_value,
		'buffer': bas_buf,
		'hex'   : mBuffer.convBufferToHexString(bas_buf),
		'desc'  : bas_desc
	};
	structure.push(bas);

	var parsed = {
		'message': {
			'angle': bas_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var angle = data['angle'];
	if(typeof(angle) !== 'number' || angle < 0 || angle > 180 || angle % 1 > 0) {
		throw new Error('The "angle" property in the 1st argument "data" is invalid.');
	}

	var buf = Buffer.alloc(1);
	buf.writeUInt8(angle);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
