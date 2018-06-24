/* ------------------------------------------------------------------
* node-echonet-lite - 02-60-89.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 60 : Electrically operated blind/shade class
* - EPC              : 89 : Fault description (Recoverable faults)
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'FC': {
				'field': 'Fault content',
				'values': {
					0x00: 'No fault',
					0x04: 'Obstacle caught',
					0x05: 'Recovery from outage',
					0x06: 'Time out',
					0x07: 'Battery low'
				}
			}
		},
		'ja': {
			'FC': {
				'field': '異常内容',
				'values': {
					0x00: '異常無し',
					0x04: '障害物挟込み',
					0x05: '停電復帰',
					0x06: 'タイムアウト',
					0x07: '電池残量低下'
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
	if(buf.length !== 2) {
		return null;
	}
	// Fault content
	let fc_buf = buf.slice(0, 2);
	let fc_key = 'FC';
	let fc_value = fc_buf.readUInt8(0);
	let fc_hex = mBuffer.convBufferToHexString(fc_buf);
	let fc_desc = this.desc[fc_key]['values'][fc_value];

	let fc = {
		'key'   : fc_key,
		'field' : this.desc[fc_key]['field'],
		'value' : fc_value,
		'buffer': fc_buf,
		'hex'   : fc_hex,
		'desc'  : fc_desc
	};
	structure.push(fc);

	var parsed = {
		'message': {
			'desc' : fc_desc,
			'code': fc_value
		},
		'structure': structure
	}
	return parsed;
};


EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var code = data['code'];
	if(typeof(code) !== 'number' || code < 0x00 || code > 0xFF) {
		throw new Error('The "code" property in the 1st argument "data" is invalid.');
	}
	let code1 = (code === 0x00) ? 0x00 : 0x02;
	var buf = Buffer.from([code, code1]);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
