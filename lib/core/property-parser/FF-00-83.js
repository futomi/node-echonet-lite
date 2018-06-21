/* ------------------------------------------------------------------
* node-echonet-lite - FF-00-83.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : FF : Super Class Group
* - Class code       : 00 : Device Object Super Class
* - EPC              : 83 : Identification number
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'MAC': {
				'field': 'Manufacturer code',
				'values': {}
			},
			'UID': {
				'field': 'Unique ID',
				'values': {}
			}
		},
		'ja': {
			'MAC': {
				'field': 'メーカコード',
				'values': {}
			},
			'UID': {
				'field': 'ユニークID',
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
	var structure = [];
	// Check the length of the buffer
	if(buf.length !== 17) {
		return null;
	}
	// Manufacturer code
	var mac_buf = buf.slice(1, 4);
	var mac_key = 'MAC';
	var mac_value = Buffer.concat([Buffer.from([0x00]), mac_buf]).readUInt32BE(0);
	var mac_hex = mBuffer.convBufferToHexString(mac_buf);
	var mac_desc = mac_hex.join(' ');
	var mac = {
		'key'   : mac_key,
		'field' : this.desc[mac_key]['field'],
		'value' : mac_value,
		'buffer': mac_buf,
		'hex'   : mac_hex,
		'desc'  : mac_desc
	};
	structure.push(mac);
	// Unique ID
	var uid_buf = buf.slice(4, 17);
	var uid_key = 'UID';
	var uid_hex = mBuffer.convBufferToHexString(uid_buf);
	var uid_desc = uid_hex.join(' ');
	var uid = {
		'key'   : uid_key,
		'field' : this.desc[uid_key]['field'],
		'buffer': uid_buf,
		'hex'   : uid_hex,
		'desc'  : uid_desc
	};
	structure.push(uid);

	var parsed = {
		'message': {
			'code': mac_value,
			'uid' : uid_hex.join('')
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
	if(typeof(code) !== 'number' || code % 1 > 0) {
		throw new Error('The "code" property in the 1st argument "data" is invalid.');
	}
	var uid = data['uid'];
	if(typeof(uid) !== 'string' || uid.length < 2 || uid.length > 26 || uid.length % 2 > 0 || uid.match(/[^0-9A-Fa-f]/)) {
		throw new Error('The "code" property in the 1st argument "data" is invalid.');
	}

	var protocol_buf = Buffer.from([0xFE]);

	var code_buf = Buffer.alloc(4);
	code_buf.writeUInt32BE(code);
	code_buf = code_buf.slice(1, 4);

	var uid_byte_list = [];
	for(var i=0; i<uid.length; i+=2) {
		var h = uid.substr(i, 1) + uid.substr(i+1, 1);
		var d = parseInt(h, 16);
		uid_byte_list.push(d);
	}
	var pad_len = 13-uid_byte_list.length;
	for(var i=0; i<pad_len; i++) {
		uid_byte_list.push(0);
	}
	var uid_buf = Buffer.from(uid_byte_list);

	var buf = Buffer.concat([protocol_buf, code_buf, uid_buf]);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
