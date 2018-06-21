/* ------------------------------------------------------------------
* node-echonet-lite - 01-30-91.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 30 : Home air conditioner class
* - EPC              : 91 : ON timer setting (time)
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'TIM': {
				'field': 'Time',
				'values': {}
			}
		},
		'ja': {
			'TIM': {
				'field': '時刻',
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
	// Time
	var tim_buf = buf.slice(0, 2);
	var tim_key = 'TIM';
	var tim_value = tim_buf.readUInt16BE(0);
	var h = tim_buf.readUInt8(0);
	var m = tim_buf.readUInt8(1);
	var tim_desc = ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2);
	var tim = {
		'key'   : tim_key,
		'field' : this.desc[tim_key]['field'],
		'value' : tim_value,
		'buffer': tim_buf,
		'hex'   : mBuffer.convBufferToHexString(tim_buf),
		'desc'  : tim_desc
	};
	structure.push(tim);

	var parsed = {
		'message': {
			'time': tim_desc
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var time = data['time'];
	if(!time || typeof(time) !== 'string' || !time.match(/^\d{1,2}\:\d{1,2}$/)) {
		throw new Error('The "time" property in the 1st argument "data" is invalid.');
	}
	var parts = time.split(':');
	var h = parseInt(parts[0], 10);
	var m = parseInt(parts[1], 10);
	if(h < 0 || h > 23 || m < 0 || m > 59) {
		throw new Error('The "time" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.from([h, m]);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
