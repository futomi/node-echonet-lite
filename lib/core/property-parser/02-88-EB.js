/* ------------------------------------------------------------------
* node-echonet-lite - 02-88-EB.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-02
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 88 : Low voltage smart electric energy meter class
* - EPC              : EB : Cumulative amounts of electric energy measured at fixed time (reverse direction)
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'YMD': {
				'field': 'Date',
				'values': {}
			},
			'HMS': {
				'field': 'Time',
				'values': {}
			},
			'ENG': {
				'field': 'Energy',
				'values': {}
			}
		},
		'ja': {
			'YMD': {
				'field': '年月日',
				'values': {}
			},
			'HMS': {
				'field': '時刻',
				'values': {}
			},
			'ENG': {
				'field': '電力量',
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
	if(buf.length !== 11) {
		return null;
	}
	// Date
	var ymd_buf = buf.slice(0, 4);
	var ymd_key = 'YMD';
	var ymd_value = ymd_buf.readUInt32BE(0);
	var Y = ymd_buf.readUInt16BE(0);
	var M = ymd_buf.readUInt8(2);
	var D = ymd_buf.readUInt8(3);
	var date = [Y, ('0' + M).slice(-2), ('0' + D).slice(-2)].join('-');
	var ymd = {
		'key'   : ymd_key,
		'field' : this.desc[ymd_key]['field'],
		'value' : ymd_value,
		'buffer': ymd_buf,
		'hex'   : mBuffer.convBufferToHexString(ymd_buf),
		'desc'  : date
	};
	structure.push(ymd);

	// Time
	var hms_buf = buf.slice(4, 7);
	var hms_key = 'HMS';
	var hms_value = Buffer.concat([(new Buffer([0x00])), hms_buf]).readUInt32BE(0);
	var h = hms_buf.readUInt8(0);
	var m = hms_buf.readUInt8(1);
	var s = hms_buf.readUInt8(2);
	var time = [('0' + h).slice(-2), ('0' + m).slice(-2), ('0' + s).slice(-2)].join(':');
	var hms = {
		'key'   : hms_key,
		'field' : this.desc[hms_key]['field'],
		'value' : hms_value,
		'buffer': hms_buf,
		'hex'   : mBuffer.convBufferToHexString(hms_buf),
		'desc'  : time
	};
	structure.push(hms);

	// Energy
	var eng_buf = buf.slice(7, 11);
	var eng_key = 'ENG';
	var eng_value = eng_buf.readUInt32BE(0);
	var eng = {
		'key'   : eng_key,
		'field' : this.desc[eng_key]['field'],
		'value' : eng_value,
		'buffer': eng_buf,
		'hex'   : mBuffer.convBufferToHexString(eng_buf),
		'desc'  : (eng_value === 0xFFFFFFFE) ? '' : eng_value.toString()
	};
	structure.push(eng);

	var parsed = {
		'message': {
			'date'  : date,
			'time'  : time,
			'energy': eng_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}

	var date = data['date'];
	if(typeof(date) !== 'string') {
		throw new Error('The "date" property in the 1st argument "data" is invalid.');
	}
	var date_m = date.match(/^(\d{4})\-(\d{2})\-(\d{2})$/);
	if(!date_m) {
		throw new Error('The "date" property in the 1st argument "data" is invalid.');
	}
	var Y = parseInt(date_m[1], 10);
	var M = parseInt(date_m[2], 10);
	var D = parseInt(date_m[3], 10);
	if(Y < 1 || Y > 9999 || M < 1 || M > 12 || D < 1 || D > 31) {
		throw new Error('The "date" property in the 1st argument "data" is invalid.');
	}

	var time = data['time'];
	if(typeof(time) !== 'string') {
		throw new Error('The "time" property in the 1st argument "data" is invalid.');
	}
	var time_m = time.match(/^(\d{2})\:(\d{2})\:(\d{2})$/);
	if(!time_m) {
		throw new Error('The "time" property in the 1st argument "data" is invalid.');
	}
	var h = parseInt(time_m[1], 10);
	var m = parseInt(time_m[2], 10);
	var s = parseInt(time_m[3], 10);
	if(h < 0 || h > 23 || m < 0 || m > 59 || s < 0 || s > 59) {
		throw new Error('The "time" property in the 1st argument "data" is invalid.');
	}

	var energy = 0xFFFFFFFE;
	if('energy' in data) {
		energy = data['energy'];
		if(typeof(energy) !== 'number' || energy < 0 || energy > 99999999) {
			throw new Error('The "energy" property in the 1st argument "data" is invalid.');
		}
	}

	var Y_buf = new Buffer(2);
	Y_buf.writeUInt16BE(Y);
	var M_buf = new Buffer(1);
	M_buf.writeUInt8(M);
	var D_buf = new Buffer(1);
	D_buf.writeUInt8(D);
	var h_buf = new Buffer(1);
	h_buf.writeUInt8(h);
	var m_buf = new Buffer(1);
	m_buf.writeUInt8(m);
	var s_buf = new Buffer(1);
	s_buf.writeUInt8(s);
	var e_buf = new Buffer(4);
	e_buf.writeUInt32BE(energy);

	var buf = Buffer.concat([Y_buf, M_buf, D_buf, h_buf, m_buf, s_buf, e_buf]);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
