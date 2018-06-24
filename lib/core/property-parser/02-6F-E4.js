/* ------------------------------------------------------------------
* node-echonet-lite - 02-6F-E4.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 6F : Electric lock class
* - EPC              : E4 : Occupant/non-occupant status
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'OCC': {
				'field': 'Occupant/non-occupant status',
				'values': {
					0x41: 'Occupant',
					0x42: 'Non-occupant'
				}
			}
		},
		'ja': {
			'OCC': {
				'field': '扉開閉状態',
				'values': {
					0x41: '在室',
					0x42: '不在'
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
	// Occupant/non-occupant status
	let occ_buf = buf.slice(0, 1);
	let occ_key = 'OCC';
	let occ_value = occ_buf.readUInt8(0);
	let occ = {
		'key'   : occ_key,
		'field' : this.desc[occ_key]['field'],
		'value' : occ_value,
		'buffer': occ_buf,
		'hex'   : mBuffer.convBufferToHexString(occ_buf),
		'desc'  : this.desc[occ_key]['values'][occ_value]
	};
	structure.push(occ);

	let parsed = {
		'message': {
			'occupant': (occ_value === 0x41) ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let occupant = data['occupant'];
	if(typeof(occupant) !== 'boolean') {
		throw new Error('The "occupant" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	var occupant_value = occupant ? 0x41 : 0x42;
	buf.writeUInt8(occupant_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
