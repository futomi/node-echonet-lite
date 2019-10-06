/* ------------------------------------------------------------------
* node-echonet-lite - 02-63-E2.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-05
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 72 : Instantaneous water heater class
* - EPC              : E2 : Bath water heater status
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'BHS': {
				'field': 'Bath water heater status',
				'values': {
					0x41: 'Heating',
					0x42: 'Not heating'
				}
			}
		},
		'ja': {
			'BHS': {
				'field': '風呂給湯器燃焼状態',
				'values': {
					0x41: '燃焼状態有',
					0x42: '燃焼状態無'
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
	// Bath water heater status
	var bhs_buf = buf.slice(0, 1);
	var bhs_key = 'BHS';
	var bhs_value = bhs_buf.readUInt8(0);
	var bhs_desc = this.desc[bhs_key]['values'][bhs_value] || '';
	var bhs = {
		'key'   : bhs_key,
		'field' : this.desc[bhs_key]['field'],
		'value' : bhs_value,
		'buffer': bhs_buf,
		'hex'   : mBuffer.convBufferToHexString(bhs_buf),
		'desc'  : bhs_desc
	};
	structure.push(bhs);

	var parsed = {
		'message': {
			'status': (bhs_value === 0x41) ? true : false,
			'desc': bhs_desc
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
