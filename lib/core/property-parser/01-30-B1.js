/* ------------------------------------------------------------------
* node-echonet-lite - 01-30-B1.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-06
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 30 : Home air conditioner class
* - EPC              : B1 : Automatic temperature control setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'AUT': {
				'field': 'Automatic temperature control setting',
				'values': {
					0x41: 'Automatic',
					0x42: 'Non-automatic'
				}
			}
		},
		'ja': {
			'AUT': {
				'field': '温度自動設定',
				'values': {
					0x41: 'AUTO',
					0x42: '非AUTO'
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
	var structure = [];
	// Check the length of the buffer
	if(buf.length !== 1) {
		return null;
	}
	// Automatic temperature control setting
	var aut_buf = buf.slice(0, 1);
	var aut_key = 'AUT';
	var aut_value = aut_buf.readUInt8(0);
	var aut_desc = this.desc[aut_key]['values'][aut_value] || '';
	var aut = {
		'key'   : aut_key,
		'field' : this.desc[aut_key]['field'],
		'value' : aut_value,
		'buffer': aut_buf,
		'hex'   : mBuffer.convBufferToHexString(aut_buf),
		'desc'  : aut_desc
	};
	structure.push(aut);

	var parsed = {
		'message': {
			'auto': (aut_value === 0x41) ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var auto = data['auto'];
	if(typeof(auto) !== 'boolean') {
		throw new Error('The "auto" property in the 1st argument "data" is invalid.');
	}
	var auto_value = auto ? 0x41 : 0x42;
	var buf = new Buffer(1);
	buf.writeUInt8(auto_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
