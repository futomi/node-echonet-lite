/* ------------------------------------------------------------------
* node-echonet-lite - 01-30-C9.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 30 : Home air conditioner class
* - EPC              : C9 : Air refresher function setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'MNS': {
				'field': 'Negative ion type',
				'values': {}
			},
			'CLT': {
				'field': 'Cluster ion type',
				'values': {}
			},
			'LVL': {
				'field': 'Level',
				'values': {}
			},
			'MOD': {
				'field': 'Mode',
				'values': {
					0: 'OFF',
					1: 'ON'
				}
			},
			'STT': {
				'field': 'State',
				'values': {
					0: 'Non-automatic',
					1: 'Automatic'
				}
			}
		},
		'ja': {
			'MNS': {
				'field': 'マイナスイオン方式',
				'values': {}
			},
			'CLT': {
				'field': 'クラスタイオン方式',
				'values': {}
			},
			'LVL': {
				'field': '制御レベル',
				'values': {}
			},
			'MOD': {
				'field': '動作モード',
				'values': {
					0: 'OFF',
					1: 'ON'
				}
			},
			'STT': {
				'field': '制御状態',
				'values': {
					0: '非Auto',
					1: 'Auto'
				}
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
	if(buf.length !== 8) {
		return null;
	}

	var offset = 0;
	var message = {};
	['MNS', 'CLT'].forEach((bse_key) => {
		var msg_key = (bse_key === 'MNS') ? 'minus' : 'cluster';

		var bse_buf = buf.slice(offset, offset + 1);
		var bse_value = bse_buf.readUInt8(0);
		var bse = {
			'key'      : bse_key,
			'field'    : this.desc[bse_key]['field'],
			'value'    : bse_value,
			'buffer'   : bse_buf,
			'hex'      : mBuffer.convBufferToHexString(bse_buf),
			'structure': []
		};
		// Level
		var lvl_key = 'LVL';
		var lvl_value = bse_value & 0b00000111;
		var lvl_buf = Buffer.from([lvl_value]);
		bse['structure'].push({
			'key'      : lvl_key,
			'field'    : this.desc[lvl_key]['field'],
			'value'    : lvl_value,
			'buffer'   : lvl_buf,
			'hex'      : mBuffer.convBufferToHexString(lvl_buf),
			'desc'     : lvl_value.toString()
		});
		message[msg_key + '_level'] = lvl_value;
		// Mode
		var mod_key = 'MOD';
		var mod_value = (bse_value & 0b00001000) >> 3;
		var mod_buf = Buffer.from([mod_value]);
		bse['structure'].push({
			'key'      : mod_key,
			'field'    : this.desc[mod_key]['field'],
			'value'    : mod_value,
			'buffer'   : mod_buf,
			'hex'      : mBuffer.convBufferToHexString(mod_buf),
			'desc'     : this.desc[mod_key]['values'][mod_value]
		});
		message[msg_key + '_mode'] = mod_value ? true : false;
		// State
		var stt_key = 'STT';
		var stt_value = (bse_value & 0b00010000) >> 4;
		var stt_buf = Buffer.from([stt_value]);
		bse['structure'].push({
			'key'      : stt_key,
			'field'    : this.desc[stt_key]['field'],
			'value'    : stt_value,
			'buffer'   : stt_buf,
			'hex'      : mBuffer.convBufferToHexString(stt_buf),
			'desc'     : this.desc[stt_key]['values'][stt_value]
		});
		message[msg_key + '_state'] = stt_value ? true : false;

		structure.push(bse);
		offset ++;
	});

	var parsed = {
		'message': message,
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}

	var buf_list = [];
	['minus', 'cluster'].forEach(function(k) {
		var level_key = k + '_level';
		var level = data[level_key];
		if(typeof(level) !== 'number' || level < 0 || level > 7 || level % 1 > 0) {
			throw new Error('The "' + level_key + '" property in the 1st argument "data" is invalid.');
		}

		var mode_key = k + '_mode';
		var mode = data[mode_key];
		if(typeof(mode) !== 'boolean') {
			throw new Error('The "' + mode_key + '" property in the 1st argument "data" is invalid.');
		}

		var state_key = k + '_state';
		var state = data[state_key];
		if(typeof(state) !== 'boolean') {
			throw new Error('The "' + state_key + '" property in the 1st argument "data" is invalid.');
		}

		var bin = '';
		bin += (state ? '1' : '0');
		bin += (mode ? '1' : '0');
		bin += ('00' + level.toString(2)).slice(-3)
		var buf = Buffer.alloc(1);
		buf.writeInt8(parseInt(bin, 2));
		buf_list.push(buf);
	});

	buf_list.push(Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))
	return Buffer.concat(buf_list);
};

module.exports = new EchonetLitePropertyParser();
