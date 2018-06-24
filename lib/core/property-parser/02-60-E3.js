/* ------------------------------------------------------------------
* node-echonet-lite - 02-60-E3.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 60 : Electrically operated blind/shade class
* - EPC              : E3 : Open/close (extension/retraction) speed
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'OCS': {
				'field': 'Open/close (extension/retraction) speed',
				'values': {
					0x41: 'Low',
					0x42: 'Medium',
					0x43: 'High'
				}
			}
		},
		'ja': {
			'OCS': {
				'field': '開閉（張出し／収納）速度設定',
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
	// Open/close (extension/retraction) speed
	let ocs_buf = buf.slice(0, 1);
	let ocs_key = 'OCS';
	let ocs_value = ocs_buf.readUInt8(0);
	let ocs = {
		'key'   : ocs_key,
		'field' : this.desc[ocs_key]['field'],
		'value' : ocs_value,
		'buffer': ocs_buf,
		'hex'   : mBuffer.convBufferToHexString(ocs_buf),
		'desc'  : this.desc[ocs_key]['values'][ocs_value]
	};
	structure.push(ocs);

	let parsed = {
		'message': {
			'speed': ocs_value - 0x40
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
