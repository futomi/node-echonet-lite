/* ------------------------------------------------------------------
* node-echonet-lite - 05-FF-CB.js
*
* Copyright (c) 2017, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2017-11-29
*
* - Class group code : 05 : Management/Operation-related Device Class Group
* - Class code       : FF : Controller
* - EPC              : CB : Registered information renewal version information of the device to be controlled
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'VER': {
				'field': 'Registered information renewal version information of the device to be controlled',
				'values': {}
			}
		},
		'ja': {
			'VER': {
				'field': '管理対象機器登録情報更新バージョン情報',
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
	var structure = [];
	// Check the length of the buffer
	if(buf.length !== 2) {
		return null;
	}
	// Registered information renewal version information of the device to be controlled
	var ver_buf = buf.slice(0, 2);
	var ver_key = 'VER';
	var ver_value = ver_buf.readUInt16BE(0);
	var ver = {
		'key'   : ver_key,
		'field' : this.desc[ver_key]['field'],
		'value' : ver_value,
		'buffer': ver_buf,
		'hex'   : mBuffer.convBufferToHexString(ver_buf),
		'desc'  : ver_value.toString()
	};
	structure.push(ver);

	var parsed = {
		'message': {
			'version': ver_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument `data` must be an object.');
	}
	var ver = data['version'];
	if(!('version' in data)) {
		throw new Error('The `version` is required.');
	} else if(typeof(ver) !== 'number') {
		throw new Error('The `version` must be a number.');
	} else if(typeof(ver) !== 'number' || ver % 1 !== 0 || ver < 0 || ver > 65533) {
		throw new Error('The `version` must be an integer between 0 and 65533.');
	}
	var buf = Buffer.alloc(2);
	buf.writeUInt16BE(ver, 0);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
