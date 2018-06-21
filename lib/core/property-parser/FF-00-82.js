/* ------------------------------------------------------------------
* node-echonet-lite - FF-00-82.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : FF : Super Class Group
* - Class code       : 00 : Device Object Super Class
* - EPC              : 82 : Standard version information
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'RLS': {
				'field': 'Release order of the APPENDIX',
				'values': {}
			}
		},
		'ja': {
			'RLS': {
				'field': 'APPENDIXのRelease順',
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
	if(buf.length !== 4) {
		return null;
	}
	// Release order of the APPENDIX
	var rls_buf = buf.slice(2, 3);
	var rls_key = 'RLS';
	var rls_value = rls_buf.readUInt8(0);
	var rls_desc = String.fromCharCode(rls_value);
	var rls = {
		'key'   : rls_key,
		'field' : this.desc[rls_key]['field'],
		'value' : rls_value,
		'buffer': rls_buf,
		'hex'   : mBuffer.convBufferToHexString(rls_buf),
		'desc'  : rls_desc
	};
	structure.push(rls);

	var parsed = {
		'message': {
			'release': rls_desc
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var release = data['release'];
	if(typeof(release) !== 'string') {
		throw new Error('The "release" property in the 1st argument "data" is invalid.');
	}
	if(!release.match(/^[A-Za-z0-9]$/)) {
		throw new Error('The "release" property in the 1st argument "data" is an ASCII character.');
	}
	
	var buf = Buffer.from([0x00, 0x00, release.charCodeAt(0), 0x00]);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
