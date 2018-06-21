/* ------------------------------------------------------------------
* node-echonet-lite - 01-30-A1.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 30 : Home air conditioner class
* - EPC              : A1 : Automatic control of air flow direction setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'AFD': {
				'field': 'Automatic control of air flow direction setting',
				'values': {
					0x41: 'Automatic',
					0x42: 'Non-automatic',
					0x43: 'Automatic (vertical)',
					0x44: 'Automatic (horizontal)'
				}
			}
		},
		'ja': {
			'AFD': {
				'field': '風向自動設定',
				'values': {
					0x41: 'AUTO',
					0x42: '非AUTO',
					0x43: '上下AUTO',
					0x44: '左右AUTO'
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
	// Automatic control of air flow direction setting
	var afd_buf = buf.slice(0, 1);
	var afd_key = 'AFD';
	var afd_value = afd_buf.readUInt8(0);
	var afd_desc = this.desc[afd_key]['values'][afd_value] || '';
	var afd = {
		'key'   : afd_key,
		'field' : this.desc[afd_key]['field'],
		'value' : afd_value,
		'buffer': afd_buf,
		'hex'   : mBuffer.convBufferToHexString(afd_buf),
		'desc'  : afd_desc
	};
	structure.push(afd);

	var parsed = {
		'message': {
			'mode': afd_value - 0x40,
			'desc': afd_desc
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var mode = data['mode'];
	if(typeof(mode) !== 'number' || mode < 1 || mode > 4 || mode % 1 > 0) {
		throw new Error('The "mode" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	buf.writeUInt8(mode + 0x40);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
