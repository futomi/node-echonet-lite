/* ------------------------------------------------------------------
* node-echonet-lite - FF-00-97.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-06
*
* - Class group code : FF : Super Class Group
* - Class code       : 00 : Device Object Super Class
* - EPC              : 97 : Current time setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'H': {
				'field': 'Hour',
				'values': {}
			},
			'M': {
				'field': 'Minute',
				'values': {}
			}
		},
		'ja': {
			'H': {
				'field': '時',
				'values': {}
			},
			'M': {
				'field': '分',
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
	if(buf.length !== 2) {
		return null;
	}

	// Hour
	var h_buf = buf.slice(0, 1);
	var h_key = 'H';
	var h_value = h_buf.readUInt8(0);
	var h = {
		'key'   : h_key,
		'field' : this.desc[h_key]['field'],
		'value' : h_value,
		'buffer': h_buf,
		'hex'   : mBuffer.convBufferToHexString(h_buf),
		'desc'  : h_value.toString()
	};
	structure.push(h);

	// Minute
	var m_buf = buf.slice(1, 2);
	var m_key = 'M';
	var m_value = m_buf.readUInt8(0);
	var m = {
		'key'   : m_key,
		'field' : this.desc[m_key]['field'],
		'value' : m_value,
		'buffer': m_buf,
		'hex'   : mBuffer.convBufferToHexString(m_buf),
		'desc'  : m_value.toString()
	};
	structure.push(m);

	var parsed = {
		'message': {
			'hm': ('0' + h_value).slice(-2) + ':' + ('0' + m_value).slice(-2)
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var hm = data['hm'];
	if(!hm || typeof(hm) !== 'string' || !hm.match(/^\d{1,2}\:\d{1,2}$/)) {
		throw new Error('The "hm" property in the 1st argument "data" is invalid.');
	}

	var parts = hm.split(':');
	var h = parseInt(parts[0], 10);
	var m = parseInt(parts[1], 10);

	var buf = new Buffer(2);
	buf.writeUInt8(h, 0);
	buf.writeUInt8(m, 1);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
