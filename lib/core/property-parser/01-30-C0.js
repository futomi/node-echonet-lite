/* ------------------------------------------------------------------
* node-echonet-lite - 01-30-C0.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-06
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 30 : Home air conditioner class
* - EPC              : C0 : Ventilation function setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'VFS': {
				'field': 'Ventilation function setting',
				'values': {
					0x41: 'ON (outlet direction)',
					0x42: 'OFF',
					0x43: 'ON (intake direction)'
				}
			}
		},
		'ja': {
			'VFS': {
				'field': '換気モード設定',
				'values': {
					0x41: 'ON（排気方向）',
					0x42: 'OFF',
					0x43: 'ON（吸気方向）'
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
	var vfs_buf = buf.slice(0, 1);
	var vfs_key = 'VFS';
	var vfs_value = vfs_buf.readUInt8(0);
	var vfs_desc = this.desc[vfs_key]['values'][vfs_value] || '';
	var vfs = {
		'key'   : vfs_key,
		'field' : this.desc[vfs_key]['field'],
		'value' : vfs_value,
		'buffer': vfs_buf,
		'hex'   : mBuffer.convBufferToHexString(vfs_buf),
		'desc'  : vfs_desc
	};
	structure.push(vfs);

	var parsed = {
		'message': {
			'mode': vfs_value - 0x40,
			'desc': vfs_desc
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
	if(typeof(mode) !== 'number' || mode < 1 || mode > 3 || mode % 1 > 0) {
		throw new Error('The "mode" property in the 1st argument "data" is invalid.');
	}
	var buf = new Buffer(1);
	buf.writeUInt8(mode + 0x40);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
