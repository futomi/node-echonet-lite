/* ------------------------------------------------------------------
* node-echonet-lite - 02-63-89.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-02
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 63 : Electrically operated rain sliding door/shutter class
* - EPC              : 89 : Fault description (Recoverable faults)
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'FD': {
				'field': 'Fault description (Recoverable faults)',
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
			'FD': {
				'field': '異常内容 (復帰可能な異常)',
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
	var structure = [];
	// Check the length of the buffer
	if(buf.length !== 2) {
		return null;
	}
	// Fault description
	var fd_buf = buf.slice(0, 2);
	var fd_key = 'FD';
	var fd_value = fd_buf.readUInt8(0);
	var fd_hex = mBuffer.convBufferToHexString(fd_buf);
	var fd_desc = this.desc[fd_key]['values'][fd_value] || '';

	var fd = {
		'key'   : fd_key,
		'field' : this.desc[fd_key]['field'],
		'value' : fd_value,
		'buffer': fd_buf,
		'hex'   : fd_hex,
		'desc'  : fd_desc
	};
	structure.push(fd);

	var parsed = {
		'message': {
			'desc' : fd_desc,
			'code': fd_value
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

	var buf = Buffer.from([code, 0x02]);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
