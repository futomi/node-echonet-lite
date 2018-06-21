/* ------------------------------------------------------------------
* node-echonet-lite - 01-30-B7.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 30 : Home air conditioner class
* - EPC              : B7 : Set temperature value in dehumidifying mode
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');;

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'TMP': {
				'field': 'Set temperature value in heating mode',
				'values': {}
			}
		},
		'ja': {
			'TMP': {
				'field': '暖房モード時温度設定値',
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
	if(buf.length !== 1) {
		return null;
	}
	// Set temperature value
	var tmp_buf = buf.slice(0, 1);
	var tmp_key = 'TMP';
	var tmp_value = tmp_buf.readUInt8(0);
	var tmp_desc = tmp_value.toString() + ' ℃';

	var temperature = tmp_value;
	if(tmp_value === 0xFD) {
		temperature = null;
		tmp_desc = '';
	}

	var tmp = {
		'key'   : tmp_key,
		'field' : this.desc[tmp_key]['field'],
		'value' : tmp_value,
		'buffer': tmp_buf,
		'hex'   : mBuffer.convBufferToHexString(tmp_buf),
		'desc'  : tmp_desc
	};
	structure.push(tmp);

	var parsed = {
		'message': {
			'temperature': temperature
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var temperature = data['temperature'];
	if(typeof(temperature) !== 'number' || temperature < 0 || temperature > 50 || temperature % 1 > 0) {
		throw new Error('The "temperature" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	buf.writeUInt8(temperature);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
