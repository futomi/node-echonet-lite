/* ------------------------------------------------------------------
* node-echonet-lite - FF-00-87.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : FF : Super Class Group
* - Class code       : 00 : Device Object Super Class
* - EPC              : 87 : Current limit setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'LMT': {
				'field': 'Current limit setting',
				'values': {}
			}
		},
		'ja': {
			'LMT': {
				'field': '電流制限設定',
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
	// Current limit setting
	var lmt_buf = buf.slice(0, 1);
	var lmt_key = 'LMT';
	var lmt_value = lmt_buf.readUInt8(0);
	var lmt_desc = lmt_value.toString() + ' %';
	var lmt = {
		'key'   : lmt_key,
		'field' : this.desc[lmt_key]['field'],
		'value' : lmt_value,
		'buffer': lmt_buf,
		'hex'   : mBuffer.convBufferToHexString(lmt_buf),
		'desc'  : lmt_desc
	};
	structure.push(lmt);

	var parsed = {
		'message': {
			'limit': lmt_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var limit = data['limit'];
	if(typeof(limit) !== 'number' || limit < 0 || limit > 100 || limit % 1 > 0) {
		throw new Error('The "limit" property in the 1st argument "data" is invalid.');
	}

	var buf = Buffer.alloc(1);
	buf.writeUInt8(limit);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
