/* ------------------------------------------------------------------
* node-echonet-lite - FF-00-88.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : FF : Super Class Group
* - Class code       : 00 : Device Object Super Class
* - EPC              : 88 : Fault status
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'FS': {
				'field': 'Fault status',
				'values': {
					0x41: 'Fault encountered',
					0x42: 'No fault encountered'
				}
			}
		},
		'ja': {
			'FS': {
				'field': '異常発生状態',
				'values': {
					0x41: '異常発生有',
					0x42: '異常発生無'
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
	// Fault status
	var fs_buf = buf.slice(0, 1);
	var fs_key = 'FS';
	var fs_value = fs_buf.readUInt8(0);
	var fs = {
		'key'   : fs_key,
		'field' : this.desc[fs_key]['field'],
		'value' : fs_value,
		'buffer': fs_buf,
		'hex'   : mBuffer.convBufferToHexString(fs_buf),
		'desc'  : this.desc[fs_key]['values'][fs_value] || ''
	};
	structure.push(fs);

	var parsed = {
		'message': {
			'fault': (fs_value === 0x41) ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var fault = data['fault'];
	if(typeof(fault) !== 'boolean') {
		throw new Error('The "fault" property in the 1st argument "data" is invalid.');
	}

	var fault_buf = Buffer.alloc(1);
	if(fault === true) {
		fault_buf.writeUInt8(0x41);
	} else {
		fault_buf.writeUInt8(0x42);
	}
	return fault_buf;
};

module.exports = new EchonetLitePropertyParser();
