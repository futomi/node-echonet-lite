/* ------------------------------------------------------------------
* node-echonet-lite - FF-00-98.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-06
*
* - Class group code : FF : Super Class Group
* - Class code       : 00 : Device Object Super Class
* - EPC              : 98 : Current date setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'Y': {
				'field': 'Year',
				'values': {}
			},
			'M': {
				'field': 'Month',
				'values': {}
			},
			'D': {
				'field': 'Day',
				'values': {}
			}
		},
		'ja': {
			'Y': {
				'field': '西暦',
				'values': {}
			},
			'M': {
				'field': '月',
				'values': {}
			},
			'D': {
				'field': '日',
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

	// Year
	var y_buf = buf.slice(0, 2);
	var y_key = 'Y';
	var y_value = y_buf.readUInt16BE(0);
	var y = {
		'key'   : y_key,
		'field' : this.desc[y_key]['field'],
		'value' : y_value,
		'buffer': y_buf,
		'hex'   : mBuffer.convBufferToHexString(y_buf),
		'desc'  : y_value.toString()
	};
	structure.push(y);

	// Month
	var m_buf = buf.slice(2, 3);
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

	// Day 
	var d_buf = buf.slice(3, 4);
	var d_key = 'D';
	var d_value = d_buf.readUInt8(0);
	var d = {
		'key'   : d_key,
		'field' : this.desc[d_key]['field'],
		'value' : d_value,
		'buffer': d_buf,
		'hex'   : mBuffer.convBufferToHexString(d_buf),
		'desc'  : d_value.toString()
	};
	structure.push(d);

	var parsed = {
		'message': {
			'ymd': [y_value.toString(), ('0' + m_value).slice(-2), ('0' + d_value).slice(-2)].join('-')
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var ymd = data['ymd'];
	if(!ymd || typeof(ymd) !== 'string' || !ymd.match(/^\d{4}\-\d{2}\-\d{2}$/)) {
		throw new Error('The "ymd" property in the 1st argument "data" is invalid.');
	}

	var parts = ymd.split('-');
	var y = parseInt(parts[0], 10);
	var m = parseInt(parts[1], 10);
	var d = parseInt(parts[2], 10);

	var buf = new Buffer(4);
	buf.writeUInt16BE(y, 0);
	buf.writeUInt8(m, 2);
	buf.writeUInt8(d, 3);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
