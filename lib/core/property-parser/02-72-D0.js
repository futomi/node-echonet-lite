/* ------------------------------------------------------------------
* node-echonet-lite - 02-63-D0.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-05
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 72 : Instantaneous water heater class
* - EPC              : D0 : Hot water heating status
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'HHS': {
				'field': 'Hot water heating status',
				'values': {
					0x41: 'Hot water heating status found',
					0x42: 'Hot water heating status not found'
				}
			}
		},
		'ja': {
			'HHS': {
				'field': '給湯器燃焼状態',
				'values': {
					0x41: '給湯燃焼状態有',
					0x42: '給湯燃焼状態無'
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
	// Hot water heating status
	var hhs_buf = buf.slice(0, 1);
	var hhs_key = 'HHS';
	var hhs_value = hhs_buf.readUInt8(0);
	var hhs_desc = this.desc[hhs_key]['values'][hhs_value] || '';
	var hhs = {
		'key'   : hhs_key,
		'field' : this.desc[hhs_key]['field'],
		'value' : hhs_value,
		'buffer': hhs_buf,
		'hex'   : mBuffer.convBufferToHexString(hhs_buf),
		'desc'  : hhs_desc
	};
	structure.push(hhs);

	var parsed = {
		'message': {
			'status': (hhs_value === 0x41) ? true : false,
			'desc': hhs_desc
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
