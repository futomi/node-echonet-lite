/* ------------------------------------------------------------------
* node-echonet-lite - 02-63-ED.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-02
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 63 : Electrically operated rain sliding door/shutter class
* - EPC              : ED : Slit degree-of-opening
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'SDO': {
				'field': 'Slit degree-of-opening',
				'values': {}
			}
		},
		'ja': {
			'SDO': {
				'field': 'スリット開度設定',
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
	// Slit degree-of-opening
	var sdo_buf = buf.slice(0, 1);
	var sdo_key = 'SDO';
	var sdo_value = sdo_buf.readUInt8(0) - 0x30;
	var sdo_desc = sdo_value.toString();
	var sdo = {
		'key'   : sdo_key,
		'field' : this.desc[sdo_key]['field'],
		'value' : sdo_value,
		'buffer': sdo_buf,
		'hex'   : mBuffer.convBufferToHexString(sdo_buf),
		'desc'  : sdo_desc
	};
	structure.push(sdo);

	var parsed = {
		'message': {
			'level': sdo_value
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
	if(typeof(level) !== 'number' || level < 1 || level > 8 || level % 1 > 0) {
		throw new Error('The "level" property in the 1st argument "data" is invalid.');
	}

	var buf = Buffer.alloc(1);
	buf.writeUInt8(level + 0x30);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
