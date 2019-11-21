/* ------------------------------------------------------------------
* node-echonet-lite - 00-08-BE.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-30
*
* - Class group code : 00 : Sensor-related Device Class Group
* - Class code       : 08 : Visitor sensor class
* - EPC              : BE : Visitor detection holding time
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'VDH': {
				'field': 'Visitor detection holding time',
				'values': {}
			}
		},
		'ja': {
			'VDH': {
				'field': '来客検知ホールド時間設定値',
				'values': {}
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
	// Visitor detection holding time
	let vdh_buf = buf.slice(0, 2);
	let vdh_key = 'VDH';
	let vdh_value = vdh_buf.readUInt16BE(0);
	let vdh_sec = vdh_value * 10;
	let vdh = {
		'key'   : vdh_key,
		'field' : this.desc[vdh_key]['field'],
		'value' : vdh_value,
		'buffer': vdh_buf,
		'hex'   : mBuffer.convBufferToHexString(vdh_buf),
		'desc'  : vdh_sec.toString() + ' ' + ((this.lang === 'ja') ? '秒' : 'Sec')
	};
	structure.push(vdh);

	let parsed = {
		'message': {
			'time': vdh_sec
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let time = data['time'];
	if(typeof(time) !== 'number' || time < 0 || time > 655330 || time % 1 > 0) {
		throw new Error('The "time" property must be an integer in the range of 0 to 655330');
	}
	let buf = Buffer.alloc(2);
	buf.writeUInt16BE(Math.floor(time / 10));
	return buf;
};

module.exports = new EchonetLitePropertyParser();
