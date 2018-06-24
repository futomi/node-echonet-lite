/* ------------------------------------------------------------------
* node-echonet-lite - 02-6F-E7.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 6F : Electric lock class
* - EPC              : E7 : Battery level
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'BAT': {
				'field': 'Battery level',
				'values': {
					0x40: 'Ordinary level',
					0x41: 'Notification of battery replacement'
				}
			}
		},
		'ja': {
			'BAT': {
				'field': '電池残量状態',
				'values': {
					0x40: '通常',
					0x41: '交換通知有'
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
	// Battery level
	let bat_buf = buf.slice(0, 1);
	let bat_key = 'BAT';
	let bat_value = bat_buf.readUInt8(0);
	let bat = {
		'key'   : bat_key,
		'field' : this.desc[bat_key]['field'],
		'value' : bat_value,
		'buffer': bat_buf,
		'hex'   : mBuffer.convBufferToHexString(bat_buf),
		'desc'  : this.desc[bat_key]['values'][bat_value]
	};
	structure.push(bat);

	let parsed = {
		'message': {
			'battery': (bat_value === 0x41) ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let battery = data['battery'];
	if(typeof(battery) !== 'boolean') {
		throw new Error('The "battery" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	var battery_value = battery ? 0x41 : 0x40;
	buf.writeUInt8(battery_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
