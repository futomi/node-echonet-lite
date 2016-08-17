/* ------------------------------------------------------------------
* node-echonet-lite - 02-88-E2.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-02
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 88 : Low voltage smart electric energy meter class
* - EPC              : E2 : Historical data of measured cumulative amounts of electric energy 1 (normal direction)
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'DAY': {
				'field': 'Day',
				'values': {}
			},
			'HST': {
				'field': 'History',
				'value': {}
			}
		},
		'ja': {
			'DAY': {
				'field': '日',
				'values': {}
			},
			'HST': {
				'field': '履歴',
				'value': {}
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
	if(buf.length !== 194) {
		return null;
	}
	// Day
	var day_buf = buf.slice(0, 2);
	var day_key = 'DAY';
	var day_value = day_buf.readUInt8(0);
	var day = {
		'key'   : day_key,
		'field' : this.desc[day_key]['field'],
		'value' : day_value,
		'buffer': day_buf,
		'hex'   : mBuffer.convBufferToHexString(day_buf),
		'desc'  : day_value.toString()
	};
	structure.push(day);
	// History
	var hst_buf = buf.slice(2, 194);
	var hst_key = 'HST';
	var hst_list = [];
	for(var i=0; i<192; i+=4) {
		var v = hst_buf.readUInt32BE(i);
		hst_list.push(v);
	}
	var hst = {
		'key'   : day_key,
		'field' : this.desc[day_key]['field'],
		'buffer': day_buf,
		'hex'   : mBuffer.convBufferToHexString(day_buf),
		'desc'  : hst_list.join(', ')
	};
	structure.push(hst);

	var parsed = {
		'message': {
			'day'    : day_value,
			'history': hst_list
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var day = data['day'];
	if(typeof(day) !== 'number' || day < 0 || day > 99 || day % 1 > 0) {
		throw new Error('The "day" property in the 1st argument "data" is invalid.');
	}
	var day_buf = new Buffer(2);
	day_buf.writeUInt16BE(day, 0);

	var history = data['history'];
	if(!Array.isArray(history) || history.length > 48) {
		throw new Error('The "history" property in the 1st argument "data" is invalid.');
	}
	for(var i=0; i<history.length; i++) {
		var v = history[i];
		if(typeof(v) !== 'number' || v < 0 || v > 99999999 || v % 1 > 0) {
			throw new Error('The "history" property in the 1st argument "data" is invalid.');
		}
	}
	var hst_num = history.length;
	var pad_num = 48 - hst_num;
	var buf_list = [day_buf];
	for(var i=0; i<48; i++) {
		var b = new Buffer(4);
		var v = (i < hst_num) ? history[i] : 0;
		b.writeUInt32BE(v, 0);
		buf_list.push(b);
	}

	var buf = Buffer.concat(buf_list);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
