/* ------------------------------------------------------------------
* node-echonet-lite - 02-87-B6.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-06
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 87 : Power distribution board metering class
* - EPC              : B6 : Channel range specification for instantaneous power consumption measurement (simplex)
*                    :    : 瞬時電力計測チャンネル範囲指定（片方向）
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function () {
	this.lang = 'en';
	this.descs = {
		'en': {
			'ASC': {
				'field': 'Acquisition start channel',
				'values': {}
			},
			'RAS': {
				'field': 'Range from the acquisition start channel',
				'values': {}
			}
		},
		'ja': {
			'ASC': {
				'field': '取得開始チャンネル',
				'values': {}
			},
			'RAS': {
				'field': '取得開始チャンネルからの範囲',
				'values': {}
			}
		}
	}
	this.desc = this.descs[this.lang];
};

EchonetLitePropertyParser.prototype.setLang = function (lang) {
	if (this.descs[lang]) {
		this.desc = this.descs[lang];
		this.lang = lang;
	}
	return this.lang;
};

EchonetLitePropertyParser.prototype.parse = function (buf) {
	var structure = [];
	// Check the length of the buffer
	if (buf.length !== 2) {
		return null;
	}

	// Acquisition start channel
	var asc_buf = buf.slice(0, 1);
	var asc_key = 'ASC';
	var asc_value = asc_buf.readUInt8(0);
	var asc_v = asc_value;
	if(asc_v === 0xFD) {
		asc_v = null;
	}
	var asc_desc = '';
	if(asc_v === null) {
		if(this.lang === 'ja') {
			asc_desc = '未設定';
		} else {
			asc_desc = 'No setting';
		}
	} else {
		asc_desc = asc_value.toString();
	}
	var asc = {
		'key': asc_key,
		'field': this.desc[asc_key]['field'],
		'value': asc_value,
		'buffer': asc_buf,
		'hex': mBuffer.convBufferToHexString(asc_buf),
		'desc': asc_desc
	};
	structure.push(asc);

	// Range from the acquisition start channel
	var ras_buf = buf.slice(1, 2);
	var ras_key = 'RAS';
	var ras_value = ras_buf.readUInt8(0);
	var ras_v = ras_value;
	if(ras_v === 0xFD) {
		ras_v = null;
	}
	var ras_desc = '';
	if(ras_v === null) {
		if(this.lang === 'ja') {
			ras_desc = '未設定';
		} else {
			ras_desc = 'No setting';
		}
	} else {
		ras_desc = ras_value.toString();
	}
	var ras = {
		'key': ras_key,
		'field': this.desc[ras_key]['field'],
		'value': ras_value,
		'buffer': ras_buf,
		'hex': mBuffer.convBufferToHexString(ras_buf),
		'desc': ras_desc
	};
	structure.push(ras);

	var parsed = {
		'message': {
			'start': asc_v,
			'range': ras_v
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function (data) {
	if (typeof (data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}

	var buf_list = [];

	var start = data['start'];
	if (typeof (start) === 'number') {
		if(start % 1 !== 0) {
			throw new Error('The "start" must be an integer.');
		}
		if(start >= 1 && start <= 252) {
			buf_list.push(Buffer.from([start]));
		} else {
			throw new Error('The "start" must be in the range of 1 to 252.');
		}
	} else if(start === null) {
		buf_list.push(Buffer.from([0xFD]));
	} else {
		throw new Error('The "start" must be null or an integer.');
	}

	var range = data['range'];
	if (typeof (range) === 'number') {
		if(range % 1 !== 0) {
			throw new Error('The "range" must be an integer.');
		}
		if(range >= 1 && range <= 60) {
			buf_list.push(Buffer.from([range]));
		} else {
			throw new Error('The "range" must be in the range of 1 to 60.');
		}
	} else if(range === null) {
		buf_list.push(Buffer.from([0xFD]));
	} else {
		throw new Error('The "range" must be null or an integer.');
	}

	var buf = Buffer.concat(buf_list);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
