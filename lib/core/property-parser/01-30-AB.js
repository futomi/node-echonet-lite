/* ------------------------------------------------------------------
* node-echonet-lite - 01-30-AB.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 30 : Home air conditioner class
* - EPC              : AB : Non-priority state
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'PRS': {
				'field': 'Non-priority state',
				'values': {
					0x40: 'Normal operation',
					0x41: 'Non-priority'
				}
			}
		},
		'ja': {
			'PRS': {
				'field': '非優先状態',
				'values': {
					0x40: '通常状態',
					0x41: '非優先状態'
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
	// Special state
	var prs_buf = buf.slice(0, 1);
	var prs_key = 'PRS';
	var prs_value = prs_buf.readUInt8(0);
	var prs_desc = this.desc[prs_key]['values'][prs_value] || '';
	var prs = {
		'key'   : prs_key,
		'field' : this.desc[prs_key]['field'],
		'value' : prs_value,
		'buffer': prs_buf,
		'hex'   : mBuffer.convBufferToHexString(prs_buf),
		'desc'  : prs_desc
	};
	structure.push(prs);

	var parsed = {
		'message': {
			'state': (prs_value === 0x41) ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var state = data['state'];
	if(typeof(state) !== 'boolean') {
		throw new Error('The "state" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	buf.writeUInt8(state ? 0x41 : 0x40);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
