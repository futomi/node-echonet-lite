/* ------------------------------------------------------------------
* node-echonet-lite - 02-87-B5.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-06
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 87 : Power distribution board metering class
* - EPC              : B5 : Measured instantaneous current list (simplex)
*                    :    : 瞬時電流計測値リスト（片方向）
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
			'MIC': {
				'field': 'Measured instantaneous current list',
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
			'MIC': {
				'field': '瞬時電流計測値リスト',
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

	// Measured instantaneous current
	var mic_buf = buf.slice(2);
	var mic_key = 'MIC';
	var mic_list = [];
	var mic_desc_list = [];
	for (var i = 0; i < mic_buf.length; i += 4) {
		var rt = mic_buf.readUInt32BE(i);
		if(rt === 0x7FFE7FFE) {
			mic_list.push([null, null]);
			if(this.lang === 'ja') {
				mic_desc_list.push('データなし');
			} else {
				mic_desc_list.push('no data');
			}
		} else {
			var r = mic_buf.readInt16BE(i) / 10;
			var t = mic_buf.readInt16BE(i + 2) / 10;
			mic_list.push([r, t]);
			mic_desc_list.push('R:' + r + 'A/T:' + t + 'A');
		}
	}
	var mic = {
		'key': mic_key,
		'field': this.desc[mic_key]['field'],
		'buffer': mic_buf,
		'hex': mBuffer.convBufferToHexString(mic_buf),
		'desc': mic_desc_list.join(', ')
	};
	structure.push(mic);

	var parsed = {
		'message': {
			'start': asc_v,
			'range': ras_v,
			'list': mic_list
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

	if(start === null || range === null) {
		if(start === null && range === null) {
			buf_list.push(Buffer.from([0x7F, 0xFE, 0x7F, 0xFE]));
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
		var pair = list[i];
		if (Array.isArray(pair)) {
			if (pair.length === 2) {
				pair.forEach((v) => {
					if (typeof (v) === 'number') {
						if (v >= -3276.7 && v <= 3276.5) {
							v = Math.floor(v * 10);
							var v_buf = Buffer.alloc(2);
							v_buf.writeInt16BE(v, 0);
							buf_list.push(v_buf);
						} else {
							throw new Error('The value of R/T phrase must be in the range of -3276.7 to 3276.5.');
						}
					} else if(v === null) {
						buf_list.push(Buffer.from([0x7F, 0xFE]));
					} else {
						throw new Error('The value of R/T phrase must be null or an integer.');
					}
				});
			} else {
				throw new Error('Each element in the "list" must be an array including 2 elements.');
			}
		} else if (pair === null) {
			var pair_buf = Buffer.from([0x7F, 0xFE, 0x7F, 0xFE]);
			buf_list.push(pair_buf);
		} else {
			throw new Error('Each element in the "list" must be null or an array.');
		}
	}

	var buf = Buffer.concat(buf_list);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
