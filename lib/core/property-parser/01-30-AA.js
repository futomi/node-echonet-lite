/* ------------------------------------------------------------------
* node-echonet-lite - 01-30-AA.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-06
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 30 : Home air conditioner class
* - EPC              : AA : Special state
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'SPC': {
				'field': 'Special state',
				'values': {
					0x40: 'Normal operation',
					0x41: 'Defrosting',
					0x42: 'Preheating',
					0x43: 'Heat removal'
				}
			}
		},
		'ja': {
			'SPC': {
				'field': '特殊状態',
				'values': {
					0x40: '通常状態',
					0x41: '除霜状態',
					0x42: '予熱状態',
					0x43: '排熱状態'
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
	var spc_buf = buf.slice(0, 1);
	var spc_key = 'SPC';
	var spc_value = spc_buf.readUInt8(0);
	var spc_desc = this.desc[spc_key]['values'][spc_value] || '';
	var spc = {
		'key'   : spc_key,
		'field' : this.desc[spc_key]['field'],
		'value' : spc_value,
		'buffer': spc_buf,
		'hex'   : mBuffer.convBufferToHexString(spc_buf),
		'desc'  : spc_desc
	};
	structure.push(spc);

	var parsed = {
		'message': {
			'state': spc_value - 0x40,
			'desc' : spc_desc
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
	if(typeof(state) !== 'number' || state < 0 || state > 3 || state % 1 > 0) {
		throw new Error('The "state" property in the 1st argument "data" is invalid.');
	}
	var buf = new Buffer(1);
	buf.writeUInt8(state + 0x40);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
