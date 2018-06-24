/* ------------------------------------------------------------------
* node-echonet-lite - 02-6F-E5.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 6F : Electric lock class
* - EPC              : E5 : Alarm status
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'ARM': {
				'field': 'Alarm status',
				'values': {
					0x40: 'Normal (no alarm)',
					0x41: 'Break open',
					0x42: 'Door open',
					0x43: 'Manual unlocked',
					0x44: 'Tampered'
				}
			}
		},
		'ja': {
			'ARM': {
				'field': '警報状態',
				'values': {
					0x40: '通常状態（警報なし）',
					0x41: 'こじ開け',
					0x42: '扉開放',
					0x43: '手動解錠',
					0x44: 'タンパ'
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
	// Alarm status
	let arm_buf = buf.slice(0, 1);
	let arm_key = 'ARM';
	let arm_value = arm_buf.readUInt8(0);
	let arm = {
		'key'   : arm_key,
		'field' : this.desc[arm_key]['field'],
		'value' : arm_value,
		'buffer': arm_buf,
		'hex'   : mBuffer.convBufferToHexString(arm_buf),
		'desc'  : this.desc[arm_key]['values'][arm_value]
	};
	structure.push(arm);

	let parsed = {
		'message': {
			'alarm': arm_value - 0x40
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var alarm = data['alarm'];
	if(typeof(alarm) !== 'number' || alarm < 0 || alarm > 4 || alarm % 1 > 0) {
		throw new Error('The "alarm" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	buf.writeUInt8(alarm + 0x40);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
