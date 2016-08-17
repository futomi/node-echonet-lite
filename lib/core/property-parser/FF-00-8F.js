/* ------------------------------------------------------------------
* node-echonet-lite - FF-00-8F.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-02
*
* - Class group code : FF : Super Class Group
* - Class code       : 00 : Device Object Super Class
* - EPC              : 8F : Power-saving operation setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'PS': {
				'field': 'Power-saving operation setting',
				'values': {
					0x41: 'Operating in power-saving mode',
					0x42: 'Operating in normal operation mode'
				}
			}
		},
		'ja': {
			'PS': {
				'field': '節電動作状態',
				'values': {
					0x41: '節電動作中',
					0x42: '通常動作中'
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
	// Power-saving operation setting
	var ps_buf = buf.slice(0, 1);
	var ps_key = 'PS';
	var ps_value = ps_buf.readUInt8(0);
	var ps = {
		'key'   : ps_key,
		'field' : this.desc[ps_key]['field'],
		'value' : ps_value,
		'buffer': ps_buf,
		'hex'   : mBuffer.convBufferToHexString(ps_buf),
		'desc'  : this.desc[ps_key]['values'][ps_value] || ''
	};
	structure.push(ps);

	var parsed = {
		'message': {
			'mode': (ps_value === 0x41) ? true : false
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

	var mode_buf = new Buffer(1);
	if(mode === true) {
		mode_buf.writeUInt8(0x41);
	} else {
		mode_buf.writeUInt8(0x42);
	}
	return mode_buf;
};

module.exports = new EchonetLitePropertyParser();
