/* ------------------------------------------------------------------
* node-echonet-lite - 02-60-D1.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 60 : Electrically operated blind/shade class
* - EPC              : D1 : Closing (retraction) speed setting
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'CSP': {
				'field': 'Closing (retraction) speed setting',
				'values': {
					0x41: 'Low',
					0x42: 'Medium',
					0x43: 'High'
				}
			}
		},
		'ja': {
			'CSP': {
				'field': '閉（収納）速度設定',
				'values': {
					0x41: '低',
					0x42: '中',
					0x43: '高'
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
	// Closing (retraction) speed setting
	let csp_buf = buf.slice(0, 1);
	let csp_key = 'CSP';
	let csp_value = csp_buf.readUInt8(0);
	let csp = {
		'key'   : csp_key,
		'field' : this.desc[csp_key]['field'],
		'value' : csp_value,
		'buffer': csp_buf,
		'hex'   : mBuffer.convBufferToHexString(csp_buf),
		'desc'  : this.desc[csp_key]['values'][csp_value]
	};
	structure.push(csp);

	let parsed = {
		'message': {
			'speed': csp_value - 0x40
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let speed = data['speed'];
	if(typeof(speed) !== 'number' || speed < 1 || speed > 3 || speed % 1 > 0) {
		throw new Error('The "speed" property in the 1st argument "data" is invalid.');
	}
	let speed_value = 0x40 + speed;
	let buf = Buffer.alloc(1);
	buf.writeUInt8(speed_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
