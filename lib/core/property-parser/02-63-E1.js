/* ------------------------------------------------------------------
* node-echonet-lite - 02-63-E1.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-02
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 63 : Electrically operated rain sliding door/shutter class
* - EPC              : E1 : Degree-of-opening setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'DOO': {
				'field': 'Degree-of-opening setting',
				'values': {}
			}
		},
		'ja': {
			'DOO': {
				'field': '開度レベル設定',
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
	// Degree-of-opening setting
	var doo_buf = buf.slice(0, 1);
	var doo_key = 'DOO';
	var doo_value = doo_buf.readUInt8(0);
	var doo_desc = doo_value.toString() + ' %';
	var doo = {
		'key'   : doo_key,
		'field' : this.desc[doo_key]['field'],
		'value' : doo_value,
		'buffer': doo_buf,
		'hex'   : mBuffer.convBufferToHexString(doo_buf),
		'desc'  : doo_desc
	};
	structure.push(doo);

	var parsed = {
		'message': {
			'level': doo_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var level = data['level'];
	if(typeof(level) !== 'number' || level < 0 || level > 100 || level % 1 > 0) {
		throw new Error('The "level" property in the 1st argument "data" is invalid.');
	}

	var buf = Buffer.alloc(1);
	buf.writeUInt8(level);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
