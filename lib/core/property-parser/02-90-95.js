/* ------------------------------------------------------------------
* node-echonet-lite - 02-90-95.js
*
* Copyright (c) 2017, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2017-12-01
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 90 : General lighting class
* - EPC              : 95 : OFF timer setting
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
	// OFF timer setting
	var h_buf = buf.slice(0, 1);
	var h_key = 'H';
	var h_value = h_buf.readUInt8(0);
	var h = {
		'key'   : h_key,
		'field' : this.desc[h_key]['field'],
		'value' : h_value,
		'buffer': h_buf,
		'hex'   : mBuffer.convBufferToHexString(h_buf),
		'desc'  : this.desc[h_key]['values'][h_value]
	};
	structure.push(h);

	var m_buf = buf.slice(1, 2);
	var m_key = 'M';
	var m_value = m_buf.readUInt8(0);
	var m = {
		'key'   : m_key,
		'field' : this.desc[m_key]['field'],
		'value' : m_value,
		'buffer': m_buf,
		'hex'   : mBuffer.convBufferToHexString(m_buf),
		'desc'  : this.desc[m_key]['values'][m_value]
	};
	structure.push(m);

	var parsed = {
		'message': {
			'h': h_value,
			'm': m_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}

	var h = data['h'];
	if(!('h' in data)) {
		throw new Error('The `h` is required.');
	} else if(typeof(h) !== 'number' || h < 0 || h > 23 || h % 1 !== 0) {
		throw new Error('The `h` must be an integer between 0 and 23.');
	}

	var m = data['m'];
	if(!('m' in data)) {
		throw new Error('The `m` is required.');
	} else if(typeof(m) !== 'number' || m < 0 || m > 59 || m % 1 !== 0) {
		throw new Error('The `m` must be an integer between 0 and 59.');
	}

	var buf = Buffer.from([h, m]);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
