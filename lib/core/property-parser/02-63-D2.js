/* ------------------------------------------------------------------
* node-echonet-lite - 02-63-D2.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-02
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 63 : Electrically operated rain sliding door/shutter class
* - EPC              : D2 : Operation time
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'OPT': {
				'field': 'Operation time',
				'values': {}
			}
		},
		'ja': {
			'OPT': {
				'field': '動作時間設定値',
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
	// Operation time
	var opt_buf = buf.slice(0, 1);
	var opt_key = 'OPT';
	var opt_value = opt_buf.readUInt8(0);
	var opt_desc = opt_value.toString();
	if(this.lang === 'ja') {
		opt_desc += ' 秒';
	} else {
		opt_desc += ' seconds';
	}
	var opt = {
		'key'   : opt_key,
		'field' : this.desc[opt_key]['field'],
		'value' : opt_value,
		'buffer': opt_buf,
		'hex'   : mBuffer.convBufferToHexString(opt_buf),
		'desc'  : opt_desc
	};
	structure.push(opt);

	var parsed = {
		'message': {
			'time': opt_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var time = data['time'];
	if(typeof(time) !== 'number' || time < 0 || time > 253 || time % 1 > 0) {
		throw new Error('The "time" property in the 1st argument "data" is invalid.');
	}

	var buf = Buffer.alloc(1);
	buf.writeUInt8(time);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
