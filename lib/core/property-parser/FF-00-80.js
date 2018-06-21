/* ------------------------------------------------------------------
* node-echonet-lite - FF-00-80.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : FF : Super Class Group
* - Class code       : 00 : Device Object Super Class
* - EPC              : 80 : Operating status
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'OPS': {
				'field': 'Operating status',
				'values': {
					0x30: 'ON',
					0x31: 'OFF'
				}
			}
		},
		'ja': {
			'OPS': {
				'field': '動作状態',
				'values': {
					0x30: 'ON',
					0x31: 'OFF'
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
	// Operating status
	var ops_buf = buf.slice(0, 1);
	var ops_key = 'OPS';
	var ops_value = ops_buf.readUInt8(0);
	var ops = {
		'key'   : ops_key,
		'field' : this.desc[ops_key]['field'],
		'value' : ops_value,
		'buffer': ops_buf,
		'hex'   : mBuffer.convBufferToHexString(ops_buf),
		'desc'  : this.desc[ops_key]['values'][ops_value]
	};
	structure.push(ops);

	var parsed = {
		'message': {
			'status': (ops_value === 0x30) ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var status = data['status'];
	if(typeof(status) !== 'boolean') {
		throw new Error('The "status" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	var status_value = status ? 0x30 : 0x31;
	buf.writeUInt8(status_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
