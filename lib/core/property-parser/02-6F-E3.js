/* ------------------------------------------------------------------
* node-echonet-lite - 02-6F-E3.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 6F : Electric lock class
* - EPC              : E3 : Door open/close status
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'DOO': {
				'field': 'Door open/close status',
				'values': {
					0x41: 'Open',
					0x42: 'Close'
				}
			}
		},
		'ja': {
			'DOO': {
				'field': '扉開閉状態',
				'values': {
					0x41: '開',
					0x42: '閉'
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
	// Door open/close status
	let doo_buf = buf.slice(0, 1);
	let doo_key = 'DOO';
	let doo_value = doo_buf.readUInt8(0);
	let doo = {
		'key'   : doo_key,
		'field' : this.desc[doo_key]['field'],
		'value' : doo_value,
		'buffer': doo_buf,
		'hex'   : mBuffer.convBufferToHexString(doo_buf),
		'desc'  : this.desc[doo_key]['values'][doo_value]
	};
	structure.push(doo);

	let parsed = {
		'message': {
			'open': (doo_value === 0x41) ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let open = data['open'];
	if(typeof(open) !== 'boolean') {
		throw new Error('The "open" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	var open_value = open ? 0x41 : 0x42;
	buf.writeUInt8(open_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
