/* ------------------------------------------------------------------
* node-echonet-lite - 00-12-E0.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-02
*
* - Class group code : 00 : Sensor-related device class group
* - Class code       : 11 : Humidity sensor class
* - EPC              : E0 : Measured value of relative humidity
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'TMP': {
				'field': 'Temperature',
				'values': {}
			}
		},
		'ja': {
			'TMP': {
				'field': '温度',
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
	// Set temperature value
	var tmp_buf = buf.slice(0, 2);
	var tmp_key = 'TMP';
	var tmp_value = tmp_buf.readInt16BE(0);
	var temperature = tmp_value / 10;
	var tmp_desc = temperature.toString() + ' ℃';

	if(tmp_value === 0x7FFF) {
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
	var tmp = 0x7FFF; 
	if(typeof(temperature) === 'number') {
		if(temperature < -273.2 || temperature > 3276.6) {
			throw new Error('The "temperature" property in the 1st argument "data" is invalid.');
		}
		tmp = temperature.toFixed(1) * 10;
	} else if(temperature !== null) {
		throw new Error('The "temperature" property in the 1st argument "data" is invalid.');
	}
	var buf = new Buffer(2);
	buf.writeInt16BE(tmp);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
