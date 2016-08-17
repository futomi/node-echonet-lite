/* ------------------------------------------------------------------
* node-echonet-lite - 01-30-C1.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-02
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 30 : Home air conditioner class
* - EPC              : C1 : Humidifier function setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'HFS': {
				'field': 'Humidifier function setting',
				'values': {
					0x41: 'ON',
					0x42: 'OFF'
				}
			}
		},
		'ja': {
			'HFS': {
				'field': '加湿モード設定',
				'values': {
					0x41: 'ON',
					0x42: 'OFF'
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
	// Special state
	var hfs_buf = buf.slice(0, 1);
	var hfs_key = 'HFS';
	var hfs_value = hfs_buf.readUInt8(0);
	var hfs_desc = this.desc[hfs_key]['values'][hfs_value] || '';
	var hfs = {
		'key'   : hfs_key,
		'field' : this.desc[hfs_key]['field'],
		'value' : hfs_value,
		'buffer': hfs_buf,
		'hex'   : mBuffer.convBufferToHexString(hfs_buf),
		'desc'  : hfs_desc
	};
	structure.push(hfs);

	var parsed = {
		'message': {
			'mode': (hfs_value === 0x41) ? true : false,
			'mode_desc': hfs_desc
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
	if(typeof(mode) !== 'boolean') {
		throw new Error('The "mode" property in the 1st argument "data" is invalid.');
	}
	var mode_value = mode ? 0x41 : 0x42;
	var buf = new Buffer(1);
	buf.writeInt8(mode_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
