/* ------------------------------------------------------------------
* node-echonet-lite - 02-88-ED.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-02
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 88 : Low voltage smart electric energy meter class
* - EPC              : ED : Day for which the historical data of measured cumulative amounts of electric energy is to be retrieved 2
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
			'NUM': {
				'field': 'Number',
				'values': {}
			}
		},
		'ja': {
			'YMD': {
				'field': '年月日',
				'values': {}
			},
			'HMS': {
				'field': '時分',
				'values': {}
			},
			'NUM': {
				'field': 'コマ数',
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
	if(buf.length !== 7) {
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
	if(ymd_value === 0xFFFFFFFF) {
		date = '';
	}
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
	var hms_buf = buf.slice(4, 6);
	var hms_key = 'HMS';
	var hms_value = hms_buf.readUInt16BE(0);
	var h = hms_buf.readUInt8(0);
	var m = hms_buf.readUInt8(1);
	var time = [('0' + h).slice(-2), ('0' + m).slice(-2)].join(':');
	if(hms_value === 0xFFFF) {
		time = '';
	}
	var hms = {
		'key'   : hms_key,
		'field' : this.desc[hms_key]['field'],
		'value' : hms_value,
		'buffer': hms_buf,
		'hex'   : mBuffer.convBufferToHexString(hms_buf),
		'desc'  : time
	};
	structure.push(hms);

	// Number
	var num_buf = buf.slice(6, 7);
	var num_key = 'NUM';
	var num_value = num_buf.readUInt8(0);
	var num = {
		'key'   : num_key,
		'field' : this.desc[num_key]['field'],
		'value' : num_value,
		'buffer': num_buf,
		'hex'   : mBuffer.convBufferToHexString(num_buf),
		'desc'  : num_value.toString()
	};
	structure.push(num);

	var parsed = {
		'message': {
			'date'  : date,
			'time'  : time,
			'number': num_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) === 'object' && ('date' in data) && ('time' in data) && ('number' in data)) {
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
		var time_m = time.match(/^(\d{2})\:(\d{2})/);
		if(!time_m) {
			throw new Error('The "time" property in the 1st argument "data" is invalid.');
		}
		var h = parseInt(time_m[1], 10);
		var m = parseInt(time_m[2], 10);
		if(h < 0 || h > 23 || !(m === 0 || m === 30)) {
			throw new Error('The "time" property in the 1st argument "data" is invalid.');
		}

		var number = data['number'];
		if(typeof(number) !== 'number' || number < 1 || number > 12) {
			throw new Error('The "number" property in the 1st argument "data" is invalid.');
		}

		var buf_list = [];
		var Y_buf = new Buffer(2);
		Y_buf.writeUInt16BE(Y);
		buf_list.push(Y_buf);
		var M_buf = new Buffer(1);
		M_buf.writeUInt8(M);
		buf_list.push(M_buf);
		var D_buf = new Buffer(1);
		D_buf.writeUInt8(D);
		buf_list.push(D_buf);
		var h_buf = new Buffer(1);
		h_buf.writeUInt8(h);
		buf_list.push(h_buf);
		var m_buf = new Buffer(1);
		m_buf.writeUInt8(m);
		buf_list.push(m_buf);
		var n_buf = new Buffer(1);
		n_buf.writeUInt8(number);
		buf_list.push(n_buf);

		var buf = Buffer.concat(buf_list);
		return buf;
	} else {
		var buf = new Buffer([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x01]);
		return buf;
	}
};

module.exports = new EchonetLitePropertyParser();
