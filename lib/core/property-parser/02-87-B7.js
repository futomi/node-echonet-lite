/* ------------------------------------------------------------------
* node-echonet-lite - 02-87-B7.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-06
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 87 : Power distribution board metering class
* - EPC              : B7 : Measured instantaneous power consumption list (simplex)
*                    :    : 瞬時電力計測値リスト（片方向）
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
			},
			'MIP': {
				'field': 'Measured instantaneous power consumption list',
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
			},
			'MIP': {
				'field': '瞬時電力計測値リスト',
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
	if (buf.length < 2 + 4 || buf.length > 2 + (4 * 60) || (buf.length - 2) % 4 !== 0) {
		return null;
	}

	// Acquisition start channel
	var asc_buf = buf.slice(0, 1);
	var asc_key = 'ASC';
	var asc_value = asc_buf.readUInt8(0);
	var asc_v = asc_value;
	if (asc_v === 0xFD) {
		asc_v = null;
	}
	var asc_desc = '';
	if (asc_v === null) {
		if (this.lang === 'ja') {
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
	if (ras_v === 0xFD) {
		ras_v = null;
	}
	var ras_desc = '';
	if (ras_v === null) {
		if (this.lang === 'ja') {
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

	// Measured instantaneous power consumption list
	var mip_buf = buf.slice(2);
	var mip_key = 'MIP';
	var mip_list = [];
	var mip_desc_list = [];
	for (var i = 0; i < mip_buf.length; i += 4) {
		var p = mip_buf.readUInt32BE(i);
		if (p === 0x7FFFFFFE) {
			mip_list.push(null);
			if (this.lang === 'ja') {
				mip_desc_list.push('データなし');
			} else {
				mip_desc_list.push('no data');
			}
		} else {
			p = mip_buf.readInt32BE(i);
			mip_list.push(p);
			mip_desc_list.push(p + 'W');
		}
	}
	var mip = {
		'key': mip_key,
		'field': this.desc[mip_key]['field'],
		'buffer': mip_buf,
		'hex': mBuffer.convBufferToHexString(mip_buf),
		'desc': mip_desc_list.join(', ')
	};
	structure.push(mip);

	var parsed = {
		'message': {
			'start': asc_v,
			'range': ras_v,
			'list': mip_list
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
		if (start % 1 !== 0) {
			throw new Error('The "start" must be an integer.');
		}
		if (start >= 1 && start <= 252) {
			buf_list.push(Buffer.from([start]));
		} else {
			throw new Error('The "start" must be in the range of 1 to 252.');
		}
	} else if (start === null) {
		buf_list.push(Buffer.from([0xFD]));
	} else {
		throw new Error('The "start" must be null or an integer.');
	}

	var range = data['range'];
	if (typeof (range) === 'number') {
		if (range % 1 !== 0) {
			throw new Error('The "range" must be an integer.');
		}
		if (range >= 1 && range <= 60) {
			buf_list.push(Buffer.from([range]));
		} else {
			throw new Error('The "range" must be in the range of 1 to 60.');
		}
	} else if (range === null) {
		buf_list.push(Buffer.from([0xFD]));
	} else {
		throw new Error('The "range" must be null or an integer.');
	}

	if (start === null || range === null) {
		if (start === null && range === null) {
			buf_list.push(Buffer.from([0x7F, 0xFF, 0xFF, 0xFE]));
			var buf = Buffer.concat(buf_list);
			return buf;
		} else {
			throw new Error('Both of the "start" and the "range" must be null.');
		}
	}

	var list = data['list'];
	if (!Array.isArray(list)) {
		throw new Error('The "list" property in the 1st argument "data" must be an array.');
	}
	if (list.length !== range) {
		throw new Error('The length of "list" must be equal to the value of "range".');
	}
	for (var i = 0; i < list.length; i++) {
		var v = list[i];
		if (typeof (v) === 'number') {
			if (v >= -2147483647 && v <= 2147483645 && v % 1 === 0) {
				var v_buf = Buffer.alloc(4);
				v_buf.writeInt32BE(v, 0);
				buf_list.push(v_buf);
			} else {
				throw new Error('Each value in the list must be an integer in the range of -2147483647 to 2147483645.');
			}
		} else if (v === null) {
			buf_list.push(Buffer.from([0x7F, 0xFF, 0xFF, 0xFE]));
		} else {
			throw new Error('Each value in the list must be null or an integer.');
		}
	}

	var buf = Buffer.concat(buf_list);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
