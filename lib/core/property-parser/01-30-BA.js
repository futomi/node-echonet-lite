/* ------------------------------------------------------------------
* node-echonet-lite - 01-30-BA.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 30 : Home air conditioner class
* - EPC              : BA : Measured value of room relative humidity
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'HMT': {
				'field': 'Room relative humidity',
				'values': {}
			}
		},
		'ja': {
			'HMT': {
				'field': '室内相対湿度',
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
	// Room relative humidity
	var hmt_buf = buf.slice(0, 1);
	var hmt_key = 'HMT';
	var hmt_value = hmt_buf.readUInt8(0);
	var hmt_desc = hmt_value.toString() + ' %';
	var hmt = {
		'key'   : hmt_key,
		'field' : this.desc[hmt_key]['field'],
		'value' : hmt_value,
		'buffer': hmt_buf,
		'hex'   : mBuffer.convBufferToHexString(hmt_buf),
		'desc'  : hmt_desc
	};
	structure.push(hmt);

	var parsed = {
		'message': {
			'humidity': hmt_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var humidity = data['humidity'];
	if(typeof(humidity) !== 'number' || humidity < 0 || humidity > 100 || humidity % 1 > 0) {
		throw new Error('The "humidity" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	buf.writeUInt8(humidity);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
