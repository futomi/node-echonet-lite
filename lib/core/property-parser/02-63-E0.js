/* ------------------------------------------------------------------
* node-echonet-lite - 02-63-E0.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-05
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 63 : Electrically operated rain sliding door/shutter class
* - EPC              : E0 : Open/close operation setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'OCO': {
				'field': 'Open/close operation setting',
				'values': {
					0x41: 'Open',
					0x42: 'Close',
					0x43: 'Stop'
				}
			}
		},
		'ja': {
			'OCO': {
				'field': '開閉動作設定',
				'values': {
					0x41: '開',
					0x42: '閉',
					0x43: '停止'
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
	// Open/close operation setting
	var oco_buf = buf.slice(0, 1);
	var oco_key = 'OCO';
	var oco_value = oco_buf.readUInt8(0);
	var oco_desc = this.desc[oco_key]['values'][oco_value] || '';
	var oco = {
		'key'   : oco_key,
		'field' : this.desc[oco_key]['field'],
		'value' : oco_value,
		'buffer': oco_buf,
		'hex'   : mBuffer.convBufferToHexString(oco_buf),
		'desc'  : oco_desc
	};
	structure.push(oco);

	var parsed = {
		'message': {
			'status': oco_value - 0x40,
			'desc': oco_desc
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var status = data['status'];
	if(!status || typeof(status) !== 'number' || !(status === 1 || status === 2 || status === 3)) {
		throw new Error('The "status" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	buf.writeUInt8(status + 0x40);
	return buf;
};


module.exports = new EchonetLitePropertyParser();
