/* ------------------------------------------------------------------
* node-echonet-lite - 02-63-E3.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-05
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 63 : Electrically operated rain sliding door/shutter class
* - EPC              : E3 : Opening/closing speed setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'OCS': {
				'field': 'Opening/closing speed setting',
				'values': {
					0x41: 'Low',
					0x42: 'Medium',
					0x43: 'High'
				}
			}
		},
		'ja': {
			'OCS': {
				'field': '開閉速度設定',
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
	var structure = [];
	// Check the length of the buffer
	if(buf.length !== 1) {
		return null;
	}
	// Opening/closing speed setting
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
			'speed': ocs_value - 0x40,
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
	var speed = data['speed'];
	if(!speed || typeof(speed) !== 'number' || !(speed === 1 || speed === 2 || speed === 3)) {
		throw new Error('The "speed" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	buf.writeUInt8(speed + 0x40);
	return buf;
};


module.exports = new EchonetLitePropertyParser();
