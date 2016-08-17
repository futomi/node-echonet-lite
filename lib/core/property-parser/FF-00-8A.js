/* ------------------------------------------------------------------
* node-echonet-lite - FF-00-8A.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-02
*
* - Class group code : FF : Super Class Group
* - Class code       : 00 : Device Object Super Class
* - EPC              : 8A : Manufacturer code
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
			}
		},
		'ja': {
			'MAC': {
				'field': 'メーカコード',
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
	if(buf.length !== 3) {
		return null;
	}
	// Manufacturer code
	var mac_buf = buf.slice(0, 3);
	var mac_key = 'MAC';
	var mac_value = Buffer.concat([(new Buffer([0x00])), mac_buf]).readUInt32BE(0);
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

	var parsed = {
		'message': {
			'code': mac_value
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
	if(!code || typeof(code) !== 'number') {
		throw new Error('The "code" property in the 1st argument "data" is invalid.');
	}
	var buf = new Buffer(4);
	buf.writeUInt32BE(code);
	buf = buf.slice(1, 4);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
