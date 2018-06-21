/* ------------------------------------------------------------------
* node-echonet-lite - 0E-F0-82.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 0E : Profile class group
* - Class code       : F0 : Node profile class
* - EPC              : 82 : Version information
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'V1': {
				'field': 'Major version number',
				'values': {}
			},
			'V2': {
				'field': 'Minor version number',
				'values': {}
			},
			'SMT': {
				'field': 'Supported message type',
				'values': {
					0x01: 'Specified message format',
					0x02: 'Arbitrary message format'
				}
			}
		},
		'ja': {
			'V1': {
				'field': 'メジャーバージョン',
				'values': {}
			},
			'V2': {
				'field': 'マイナーバージョン',
				'values': {}
			},
			'SMT': {
				'field': '対応電文タイプ',
				'values': {
					0x01: '規定電文形式',
					0x02: '任意電文形式'
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
	if(buf.length !== 4) {
		return null;
	}
	// Major version number
	var v1_buf = buf.slice(0, 1);
	var v1_key = 'V1';
	var v1_value = v1_buf.readUInt8(0);
	var v1 = {
		'key'   : v1_key,
		'field' : this.desc[v1_key]['field'],
		'value' : v1_value,
		'buffer': v1_buf,
		'hex'   : mBuffer.convBufferToHexString(v1_buf),
		'desc'  : v1_value.toString()
	};
	structure.push(v1);
	// Minor version number
	var v2_buf = buf.slice(1, 2);
	var v2_key = 'V2';
	var v2_value = v2_buf.readUInt8(0);
	var v2 = {
		'key'   : v2_key,
		'field' : this.desc[v2_key]['field'],
		'value' : v2_value,
		'buffer': v2_buf,
		'hex'   : mBuffer.convBufferToHexString(v2_buf),
		'desc'  : v2_value.toString()
	};
	structure.push(v2);
	// Supported message type
	var smt_buf = buf.slice(2, 3);
	var smt_key = 'SMT';
	var smt_value = smt_buf.readUInt8(0);
	var smt = {
		'key'   : smt_key,
		'field' : this.desc[smt_key]['field'],
		'value' : smt_value,
		'buffer': smt_buf,
		'hex'   : mBuffer.convBufferToHexString(smt_buf),
		'desc'  : this.desc[smt_key]['values'][smt_value]
	};
	structure.push(smt);

	var version = v1_value.toString() + '.' + v2_value.toString();
	version = parseFloat(version);
	var parsed = {
		'message': {
			'version': version,
			'type': smt_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var version = data['version'];
	if(typeof(version) !== 'string') {
		throw new Error('The "version" property in the 1st argument "data" is invalid.');
	}
	var m = version.match(/^(\d{1,3})\.(\d{1,3})$/);
	if(!m) {
		throw new Error('The "version" property in the 1st argument "data" is invalid.');
	}
	var major = parseInt(m[1], 10);
	var minor = parseInt(m[2], 10);
	if(major > 255 || minor > 255) {
		throw new Error('The "version" property in the 1st argument "data" is invalid.');
	}

	var type = data['type'];
	if(type !== 1 && type !== 2) {
		throw new Error('The "type" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.from([major, minor, type, 0x00]);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
