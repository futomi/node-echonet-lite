/* ------------------------------------------------------------------
* node-echonet-lite - 05-FF-C5.js
*
* Copyright (c) 2017, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2017-11-29
*
* - Class group code : 05 : Management/Operation-related Device Class Group
* - Class code       : FF : Controller
* - EPC              : C5 : Name
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'NAM': {
				'field': 'Name',
				'values': {}
			}
		},
		'ja': {
			'NAM': {
				'field': '名称',
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
	if(buf.length > 64) {
		return null;
	}
	// Name
	var nam_buf = buf.slice(0);
	var nam_key = 'NAM';
	var nam_hex = mBuffer.convBufferToHexString(nam_buf);
	var nam_desc = nam_buf.toString('utf8');
	var nam = {
		'key'   : nam_key,
		'field' : this.desc[nam_key]['field'],
		'buffer': nam_buf,
		'hex'   : nam_hex,
		'desc'  : nam_desc
	};
	structure.push(nam);

	var parsed = {
		'message': {
			'name': nam_desc
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument `data` must be an object.');
	}
	var name = data['name'];
	if(!('name' in data)) {
		throw new Error('The `name` is required.');
	} else if(typeof(name) !== 'string') {
		throw new Error('The `name` must be a string.');
	}
	var buf = Buffer.from(name, 'utf8');
	if(buf.length > 64) {
		throw new Error('The `name` is too long.');
	}
	return buf;
};

module.exports = new EchonetLitePropertyParser();
