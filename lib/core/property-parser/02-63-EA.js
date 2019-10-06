/* ------------------------------------------------------------------
* node-echonet-lite - 02-63-EA.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-05
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 63 : Electrically operated rain sliding door/shutter class
* - EPC              : EA : Open/closed status
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'OCS': {
				'field': 'Open/closed status',
				'values': {
					0x41: 'Fully open',
					0x42: 'Fully closed',
					0x43: 'Opening',
					0x44: 'Closing',
					0x45: 'Stopped halfway'
				}
			}
		},
		'ja': {
			'OCS': {
				'field': '開閉状態',
				'values': {
					0x41: '全開',
					0x42: '全閉',
					0x43: '開動作中',
					0x44: '閉動作中',
					0x45: '途中停止',
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
	// Open/closed status
	var ocs_buf = buf.slice(0, 1);
	var ocs_key = 'OCS';
	var ocs_value = ocs_buf.readUInt8(0);
	var ocs_desc = this.desc[ocs_key]['values'][ocs_value] || '';
	var ocs = {
		'key'   : ocs_key,
		'field' : this.desc[ocs_key]['field'],
		'value' : ocs_value,
		'buffer': ocs_buf,
		'hex'   : mBuffer.convBufferToHexString(ocs_buf),
		'desc'  : ocs_desc
	};
	structure.push(ocs);

	var parsed = {
		'message': {
			'status': ocs_value - 0x40,
			'desc': ocs_desc
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
	if(!status || typeof(status) !== 'number' || status % 1 !== 0 || status < 1 || status > 5) {
		throw new Error('The "status" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	buf.writeUInt8(status + 0x40);
	return buf;
};


module.exports = new EchonetLitePropertyParser();
