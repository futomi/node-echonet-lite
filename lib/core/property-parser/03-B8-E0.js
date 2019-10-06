/* ------------------------------------------------------------------
* node-echonet-lite - 03-B8-E0.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-06
*
* - Class group code : 03 : Housing/Facilities-related Device Class Group
* - Class code       : B8 : Combination microwave oven (electronic oven) class
* - EPC              : E0 : Heating mode setting
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'HMS': {
				'field': 'Heating mode setting',
				'values': {
					0x41: 'Microwave heating',
					0x42: 'Defrosting',
					0x43: 'Oven',
					0x44: 'Grill',
					0x45: 'Toaster',
					0x46: 'Fermenting',
					0x47: 'Stewing',
					0x48: 'Steaming',
					0x51: 'Two-stage microwave heating',
					0xFF: 'No mode specified'
				}
			}
		},
		'ja': {
			'HMS': {
				'field': '加熱モード設定',
				'values': {
					0x41: '電子レンジ加熱',
					0x42: '解凍',
					0x43: 'オーブン',
					0x44: 'グリル',
					0x45: 'トースト',
					0x46: '発酵',
					0x47: '煮込み',
					0x48: 'スチーム加熱',
					0x51: '電子レンジ２段加熱',
					0xFF: '未設定'
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
	let structure = [];
	// Check the length of the buffer
	if(buf.length !== 1) {
		return null;
	}
	// Heating mode setting
	let hms_buf = buf.slice(0, 1);
	let hms_key = 'HMS';
	let hms_value = hms_buf.readUInt8(0);
	let hms_v = hms_value;
	if(hms_v === 0xff) {
		hms_v = null;
	} else {
		hms_v = hms_v - 0x40;
	}
	let hms_desc = this.desc[hms_key]['values'][hms_value];
	let hms = {
		'key'   : hms_key,
		'field' : this.desc[hms_key]['field'],
		'value' : hms_value,
		'buffer': hms_buf,
		'hex'   : mBuffer.convBufferToHexString(hms_buf),
		'desc'  : hms_desc
	};
	structure.push(hms);

	let parsed = {
		'message': {
			'mode': hms_v,
			'desc': hms_desc
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let mode = data['mode'];
	if(typeof(mode) === 'number' && mode % 1 === 0) {
		if((mode >= 1 && mode <= 8) || mode === 17) {
			mode += 0x40;
		} else {
			throw new Error('The "mode" must be 1...8 or 17.');
		}
	} else if(mode === null) {
		mode = 0xff;
	} else {
		throw new Error('The "mode" must be null or an integer.');
	}
	let buf = Buffer.alloc(1);
	buf.writeUInt8(mode);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
