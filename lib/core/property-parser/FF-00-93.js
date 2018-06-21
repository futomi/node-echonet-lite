/* ------------------------------------------------------------------
* node-echonet-lite - FF-00-93.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : FF : Super Class Group
* - Class code       : 00 : Device Object Super Class
* - EPC              : 93 : Remote control setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'RC': {
				'field': 'Remote control setting',
				'values': {
					0x41: 'Remote control not through a public network',
					0x42: 'Remote control through a public network',
					0x61: 'Remote control is now allowed',
					0x62: 'Remote control is allawed'
				}
			}
		},
		'ja': {
			'RC': {
				'field': '遠隔操作設定',
				'values': {
					0x41: '公衆回線未経由操作',
					0x42: '公衆回線経由操作',
					0x61: '公衆回線経由の操作不可',
					0x62: '公衆回線経由の操作可能'
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
	// Remote control setting
	var rc_buf = buf.slice(0, 1);
	var rc_key = 'RC';
	var rc_value = rc_buf.readUInt8(0);
	var rc_desc = this.desc[rc_key]['values'][rc_value] || '';
	var rc = {
		'key'   : rc_key,
		'field' : this.desc[rc_key]['field'],
		'value' : rc_value,
		'buffer': rc_buf,
		'hex'   : mBuffer.convBufferToHexString(rc_buf),
		'desc'  : rc_desc
	};
	structure.push(rc);

	var parsed = {
		'message': {
			'code': rc_value,
			'desc': rc_desc
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
	if(!code || typeof(code) !== 'number' || !(code === 0x41 || code === 0x42 || code === 0x61 || code === 0x62)) {
		throw new Error('The "code" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	buf.writeUInt8(code);
	return buf;
};


module.exports = new EchonetLitePropertyParser();
