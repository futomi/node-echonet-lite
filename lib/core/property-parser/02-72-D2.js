/* ------------------------------------------------------------------
* node-echonet-lite - 02-63-D2.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-05
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 72 : Instantaneous water heater class
* - EPC              : D2 : Hot water warmer setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'HWS': {
				'field': 'Hot water warmer setting',
				'values': {
					0x41: 'Hot water warmer operation',
					0x42: 'Hot water warmer operation resetting'
				}
			}
		},
		'ja': {
			'HWS': {
				'field': '給湯保温設定',
				'values': {
					0x41: '給湯保温動作',
					0x42: '給湯保温動作解除'
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
	// Hot water warmer setting
	var hws_buf = buf.slice(0, 1);
	var hws_key = 'HWS';
	var hws_value = hws_buf.readUInt8(0);
	var hws_desc = this.desc[hws_key]['values'][hws_value] || '';
	var hws = {
		'key'   : hws_key,
		'field' : this.desc[hws_key]['field'],
		'value' : hws_value,
		'buffer': hws_buf,
		'hex'   : mBuffer.convBufferToHexString(hws_buf),
		'desc'  : hws_desc
	};
	structure.push(hws);

	var parsed = {
		'message': {
			'status': (hws_value === 0x41) ? true : false,
			'desc': hws_desc
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
	var status_value = status ? 0x41 : 0x42;
	buf.writeUInt8(status_value);
	return buf;
};


module.exports = new EchonetLitePropertyParser();
