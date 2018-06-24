/* ------------------------------------------------------------------
* node-echonet-lite - 02-60-D2.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 60 : Electrically operated blind/shade class
* - EPC              : D1 : Operation time
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'OTM': {
				'field': 'Operation time',
				'values': {}
			}
		},
		'ja': {
			'OTM': {
				'field': '動作時間設定値',
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
	if(buf.length !== 1) {
		return null;
	}
	// Operation time
	let otm_buf = buf.slice(0, 1);
	let otm_key = 'OTM';
	let otm_value = otm_buf.readUInt8(0);
	let otm = {
		'key'   : otm_key,
		'field' : this.desc[otm_key]['field'],
		'value' : otm_value,
		'buffer': otm_buf,
		'hex'   : mBuffer.convBufferToHexString(otm_buf),
		'desc'  : otm_value + ((this.lang === 'en') ? ' sec' : ' 秒')
	};
	structure.push(otm);

	let parsed = {
		'message': {
			'time': otm_value
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
	if(typeof(time) !== 'number' || time < 0 || time > 253 || time % 1 > 0) {
		throw new Error('The "time" property in the 1st argument "data" is invalid.');
	}
	let buf = Buffer.alloc(1);
	buf.writeUInt8(time);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
