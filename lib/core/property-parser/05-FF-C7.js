/* ------------------------------------------------------------------
* node-echonet-lite - 05-FF-C7.js
*
* Copyright (c) 2017, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2017-11-29
*
* - Class group code : 05 : Management/Operation-related Device Class Group
* - Class code       : FF : Controller
* - EPC              : C7 : Business code of the device to be controlled
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'BUC': {
				'field': 'Business code of the device to be controlled',
				'values': {}
			}
		},
		'ja': {
			'BUC': {
				'field': '管理対象機器事業者コード',
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
	if(buf.length !== 3) {
		return null;
	}
	// Business code of the device to be controlled
	var buc_buf = buf.slice(0, 3);
	var buc_key = 'BUC';
	var buc_value = Buffer.concat([(Buffer.from([0x00])), buc_buf]).readUInt32BE(0);
	var buc_hex = mBuffer.convBufferToHexString(buc_buf);
	var buc_desc = buc_hex.join(' ');
	var buc = {
		'key'   : buc_key,
		'field' : this.desc[buc_key]['field'],
		'value' : buc_value,
		'buffer': buc_buf,
		'hex'   : buc_hex,
		'desc'  : buc_desc
	};
	structure.push(buc);

	var parsed = {
		'message': {
			'code': buc_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument `data` must be an object.');
	}
	var code = data['code'];
	if(!('code' in data)) {
		throw new Error('The `code` is required.');
	} else if(typeof(code) !== 'number' || code % 1 !== 0 || code < 0 || code > 0xFFFFFF) {
		throw new Error('The `code` must be an integer between 0x000000 and 0xFFFFFF.');
	}
	var buf = new Buffer(4);
	buf.writeUInt32BE(code);
	buf = buf.slice(1, 4);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
