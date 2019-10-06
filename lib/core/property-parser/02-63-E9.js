/* ------------------------------------------------------------------
* node-echonet-lite - 02-63-E9.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-05
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 63 : Electrically operated rain sliding door/shutter class
* - EPC              : E9 : Selective degreeof-opening setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'SDO': {
				'field': 'Selective degreeof-opening setting',
				'values': {
					0x41: 'Degree-of-opening setting position: Open',
					0x42: 'Operation time setting value: Open',
					0x43: 'Operation time setting value: Close',
					0x44: 'Local setting position',
					0x45: 'Slit degree-of-opening setting'
				}
			}
		},
		'ja': {
			'SDO': {
				'field': '選択開度動作設定',
				'values': {
					0x41: '開度レベル設定位置開',
					0x42: '動作時間設定値開',
					0x43: '動作時間設定値閉',
					0x44: 'ローカル設定位置',
					0x45: 'スリット開度設定',
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
	var structure = [];
	// Check the length of the buffer
	if(buf.length !== 1) {
		return null;
	}
	// Selective degreeof-opening setting
	var sdo_buf = buf.slice(0, 1);
	var sdo_key = 'SDO';
	var sdo_value = sdo_buf.readUInt8(0);
	var sdo_desc = this.desc[sdo_key]['values'][sdo_value] || '';
	var sdo = {
		'key'   : sdo_key,
		'field' : this.desc[sdo_key]['field'],
		'value' : sdo_value,
		'buffer': sdo_buf,
		'hex'   : mBuffer.convBufferToHexString(sdo_buf),
		'desc'  : sdo_desc
	};
	structure.push(sdo);

	var parsed = {
		'message': {
			'mode': sdo_value - 0x40,
			'desc': sdo_desc
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var mode = data['mode'];
	if(!mode || typeof(mode) !== 'number' || mode % 1 !== 0 || mode < 1 || mode > 0xff - 0x40) {
		throw new Error('The "mode" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	buf.writeUInt8(mode + 0x40);
	return buf;
};


module.exports = new EchonetLitePropertyParser();
