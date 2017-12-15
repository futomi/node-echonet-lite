/* ------------------------------------------------------------------
* node-echonet-lite - 05-FF-C6.js
*
* Copyright (c) 2017, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2017-11-29
*
* - Class group code : 05 : Management/Operation-related Device Class Group
* - Class code       : FF : Controller
* - EPC              : C6 : Connection status
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'CNS': {
				'field': 'Connection status',
				'values': {
					0x41: 'Connected',
					0x42: 'Disconnected',
					0x43: 'Not registered',
					0x44: 'Deleted'
				}
			}
		},
		'ja': {
			'CNS': {
				'field': '接続状態',
				'values': {
					0x41: '接続中',
					0x42: '離脱中',
					0x43: '未登録',
					0x44: '削除'
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
	// Connection status
	var cns_buf = buf.slice(0, 1);
	var cns_key = 'CNS';
	var cns_value = cns_buf.readUInt8(0);
	var cns = {
		'key'   : cns_key,
		'field' : this.desc[cns_key]['field'],
		'value' : cns_value,
		'buffer': cns_buf,
		'hex'   : mBuffer.convBufferToHexString(cns_buf),
		'desc'  : this.desc[cns_key]['values'][cns_value]
	};
	structure.push(cns);

	var parsed = {
		'message': {
			'status': cns_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument `data` must be an object.');
	}
	var status = data['status'];
	if(!('status' in data)) {
		throw new Error('The `status` is required.');
	} else if(typeof(status) !== 'number') {
		throw new Error('The `status` must be a number.');
	} else if(!(status === 0x41 || status === 0x42 || status === 0x43 || status === 0x44)) {
		throw new Error('The `status` must be 0x41, 0x42, 0x43, or 0x44.');
	}
	var buf = Buffer.from([status]);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
