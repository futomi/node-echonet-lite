/* ------------------------------------------------------------------
* node-echonet-lite - 01-30-B8.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-06
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 30 : Home air conditioner class
* - EPC              : B8 : Rated power consumption
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');;

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'PW0': {
				'field': 'Rated power consumption in cooling mode',
				'values': {}
			},
			'PW1': {
				'field': 'Rated power consumption in heating mode',
				'values': {}
			},
			'PW2': {
				'field': 'Rated power consumption in dehumidifying mode',
				'values': {}
			},
			'PW3': {
				'field': 'Rated power consumption in blast mode',
				'values': {}
			}
		},
		'ja': {
			'PW0': {
				'field': '冷房モード時の定格消費電力',
				'values': {}
			},
			'PW1': {
				'field': '暖房モード時の定格消費電力',
				'values': {}
			},
			'PW2': {
				'field': '除湿モード時の定格消費電力',
				'values': {}
			},
			'PW3': {
				'field': '送風モード時の定格消費電力',
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
	if(buf.length !== 8) {
		return null;
	}
	// Rated power consumption in cooling mode
	var pw0_buf = buf.slice(0, 2);
	var pw0_key = 'PW0';
	var pw0_value = pw0_buf.readUInt16BE(0);
	var pw0_desc = pw0_value.toString() + ' W';

	var pw0 = {
		'key'   : pw0_key,
		'field' : this.desc[pw0_key]['field'],
		'value' : pw0_value,
		'buffer': pw0_buf,
		'hex'   : mBuffer.convBufferToHexString(pw0_buf),
		'desc'  : pw0_desc
	};
	structure.push(pw0);

	// Rated power consumption in heating mode
	var pw1_buf = buf.slice(2, 4);
	var pw1_key = 'PW1';
	var pw1_value = pw1_buf.readUInt16BE(0);
	var pw1_desc = pw1_value.toString() + ' W';

	var pw1 = {
		'key'   : pw1_key,
		'field' : this.desc[pw1_key]['field'],
		'value' : pw1_value,
		'buffer': pw1_buf,
		'hex'   : mBuffer.convBufferToHexString(pw1_buf),
		'desc'  : pw1_desc
	};
	structure.push(pw1);

	// Rated power consumption in dehumidifying mode
	var pw2_buf = buf.slice(4, 6);
	var pw2_key = 'PW2';
	var pw2_value = pw2_buf.readUInt16BE(0);
	var pw2_desc = pw2_value.toString() + ' W';

	var pw2 = {
		'key'   : pw2_key,
		'field' : this.desc[pw2_key]['field'],
		'value' : pw2_value,
		'buffer': pw2_buf,
		'hex'   : mBuffer.convBufferToHexString(pw2_buf),
		'desc'  : pw2_desc
	};
	structure.push(pw2);

	// Rated power consumption in blast mode
	var pw3_buf = buf.slice(6, 8);
	var pw3_key = 'PW3';
	var pw3_value = pw3_buf.readUInt16BE(0);
	var pw3_desc = pw3_value.toString() + ' W';

	var pw3 = {
		'key'   : pw3_key,
		'field' : this.desc[pw3_key]['field'],
		'value' : pw3_value,
		'buffer': pw3_buf,
		'hex'   : mBuffer.convBufferToHexString(pw3_buf),
		'desc'  : pw3_desc
	};
	structure.push(pw3);

	var parsed = {
		'message': {
			'cooling'      : pw0_value,
			'heating'      : pw1_value,
			'dehumidifying': pw2_value,
			'blast'        : pw3_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}

	var buf_list = [];
	['cooling', 'heating', 'dehumidifying', 'blast'].forEach(function(k) {
		var v = data[k];
		if(typeof(v) !== 'number' || v < 0 || v > 65533 || v % 1 > 0) {
			throw new Error('The "' + k + '" property in the 1st argument "data" is invalid.');
		}
		var buf = new Buffer(2);
		buf.writeUInt16BE(v);
		buf_list.push(buf);
	});

	return Buffer.concat(buf_list);
};

module.exports = new EchonetLitePropertyParser();
