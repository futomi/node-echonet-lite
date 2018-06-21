/* ------------------------------------------------------------------
* node-echonet-lite - 0E-F0-BF.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 0E : Profile class group
* - Class code       : F0 : Node profile class
* - EPC              : BF : Unique identifier data
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'UID': 'Unique identifier data'
		},
		'ja': {
			'UID': '個体識別情報'
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
	// Total number of classes
	var uid_buf = buf.slice(0, 2);
	var uid_key = 'UID';
	var uid_hex = mBuffer.convBufferToHexString(uid_buf);
	var uid_desc = uid_hex.join(' ');
	var uid = {
		'key'   : uid_key,
		'field' : this.desc[uid_key],
		'buffer': uid_buf,
		'hex'   : uid_hex,
		'desc'  : uid_desc
	};
	structure.push(uid);

	var parsed = {
		'message': {
			'uid': uid_hex.join('')
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var uid = data['uid'];
	if(typeof(uid) !== 'string') {
		throw new Error('The "uid" property in the 1st argument "data" is invalid.');
	}
	if(!uid.match(/^[a-fA-F0-9]{4}$/)) {
		throw new Error('The "uid" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(2);
	buf.writeUInt16BE(parseInt(uid, 16), 0);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
