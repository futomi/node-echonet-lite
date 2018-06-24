/* ------------------------------------------------------------------
* node-echonet-lite - 02-60-E9.js
*
* Copyright (c) 2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-23
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 60 : Electrically operated blind/shade class
* - EPC              : E9 : Selective opening (extension) operation setting
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'SEO': {
				'field': 'Selective opening (extension) operation setting',
				'values': {
					0x41: 'Degree-of-setting position: Open',
					0x42: 'Operation time setting value: Open',
					0x43: 'Operation time setting value: Close',
					0x44: 'Local setting position'
				}
			}
		},
		'ja': {
			'SEO': {
				'field': '選択開（張出し）度動作設定',
				'values': {
					0x41: '開度レベル設定位置開',
					0x42: '動作時間設定値開',
					0x43: '動作時間設定値閉',
					0x44: 'ローカル設定位置'
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
	// Selective opening (extension) operation setting
	let seo_buf = buf.slice(0, 1);
	let seo_key = 'SEO';
	let seo_value = seo_buf.readUInt8(0);
	let seo = {
		'key'   : seo_key,
		'field' : this.desc[seo_key]['field'],
		'value' : seo_value,
		'buffer': seo_buf,
		'hex'   : mBuffer.convBufferToHexString(seo_buf),
		'desc'  : this.desc[seo_key]['values'][seo_value]
	};
	structure.push(seo);

	let parsed = {
		'message': {
			'mode': seo_value - 0x40
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let mode = data['mode'];
	if(typeof(mode) !== 'number' || mode < 1 || mode > 9 || mode % 1 > 0) {
		throw new Error('The "mode" property in the 1st argument "data" is invalid.');
	}
	let mode_value = 0x40 + mode;
	let buf = Buffer.alloc(1);
	buf.writeUInt8(mode_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
