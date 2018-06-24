/* ------------------------------------------------------------------
* node-echonet-lite - 01-35-E1.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 35 : Air cleaner class
* - EPC              : C1 : Air pollution detection status
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'POL': {
				'field': 'Air pollution detection status',
				'values': {
					0x41: 'Air pollution detected',
					0x42: 'Air pollution non-detected'
				}
			}
		},
		'ja': {
			'POL': {
				'field': '空気汚れ検知状態',
				'values': {
					0x41: '空気汚れ検知有',
					0x42: '空気汚れ検知無'
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
	let structure = [];
	// Check the length of the buffer
	if(buf.length !== 1) {
		return null;
	}
	// Air pollution detection status
	let pol_buf = buf.slice(0, 1);
	let pol_key = 'POL';
	let pol_value = pol_buf.readUInt8(0);
	let pol = {
		'key'   : pol_key,
		'field' : this.desc[pol_key]['field'],
		'value' : pol_value,
		'buffer': pol_buf,
		'hex'   : mBuffer.convBufferToHexString(pol_buf),
		'desc'  : this.desc[pol_key]['values'][pol_value]
	};
	structure.push(pol);

	let parsed = {
		'message': {
			'pollution': (pol_value === 0x41) ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let pollution = data['pollution'];
	if(typeof(pollution) !== 'boolean') {
		throw new Error('The "pollution" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	var pollution_value = pollution ? 0x41 : 0x42;
	buf.writeUInt8(pollution_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
