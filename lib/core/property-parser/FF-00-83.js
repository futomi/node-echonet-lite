/* ------------------------------------------------------------------
* node-echonet-lite - FF-00-83.js
*
* Copyright (c) 2016-2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-31
*
* - Class group code : FF : Super Class Group
* - Class code       : 00 : Device Object Super Class
* - EPC              : 83 : Identification number
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function () {
	this.lang = 'en';
	this.descs = {
		'en': {
			'MAC': {
				'field': 'Manufacturer code',
				'values': {}
			},
			'UID': {
				'field': 'Unique ID',
				'values': {}
			}
		},
		'ja': {
			'MAC': {
				'field': 'メーカコード',
				'values': {}
			},
			'UID': {
				'field': 'ユニークID',
				'values': {}
			}
		}
	};
	this.manufacturers = {
		'en': {
			0x000005: 'Sharp Corporation',
			0x000008: 'DAIKIN INDUSTRIES,LTD',
			0x00001B: 'TOSHIBA LIGHTING & TECHNOLOGY CORPORATION',
			0x00002F: 'Aiphone Co., Ltd.',
			0x000077: 'Kanagawa Institute of Technology',
			0x00008C: 'Kyuden Technosystems Corporation'
		},
		'ja': {
			0x000005: 'シャープ株式会社',
			0x000008: 'ダイキン工業株式会社',
			0x00001B: '東芝ライテック株式会社',
			0x00002F: 'アイホン株式会社',
			0x000077: '神奈川工科大学',
			0x00008C: '九電テクノシステムズ株式会社'
		}
	};
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
	let structure = [];
	// Check the length of the buffer
	if (buf.length !== 17) {
		return null;
	}
	// Manufacturer code
	let mac_buf = buf.slice(1, 4);
	let mac_key = 'MAC';
	let mac_value = Buffer.concat([Buffer.from([0x00]), mac_buf]).readUInt32BE(0);
	let mac_hex = mBuffer.convBufferToHexString(mac_buf);
	let mac_desc = mac_hex.join(' ');
	let mac = {
		'key': mac_key,
		'field': this.desc[mac_key]['field'],
		'value': mac_value,
		'buffer': mac_buf,
		'hex': mac_hex,
		'desc': mac_desc
	};
	structure.push(mac);
	// Unique ID
	let uid_buf = buf.slice(4, 17);
	let uid_key = 'UID';
	let uid_hex = mBuffer.convBufferToHexString(uid_buf);
	let uid_desc = uid_hex.join(' ');
	let uid = {
		'key': uid_key,
		'field': this.desc[uid_key]['field'],
		'buffer': uid_buf,
		'hex': uid_hex,
		'desc': uid_desc
	};
	structure.push(uid);

	let parsed = {
		'message': {
			'code': mac_value,
			'uid': uid_hex.join(''),
			'name': this.manufacturers[this.lang][mac_value] || ''
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function (data) {
	if (typeof (data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let code = data['code'];
	if (typeof (code) !== 'number' || code % 1 > 0) {
		throw new Error('The "code" property in the 1st argument "data" is invalid.');
	}
	let uid = data['uid'];
	if (typeof (uid) !== 'string' || uid.length < 2 || uid.length > 26 || uid.length % 2 > 0 || uid.match(/[^0-9A-Fa-f]/)) {
		throw new Error('The "code" property in the 1st argument "data" is invalid.');
	}

	let protocol_buf = Buffer.from([0xFE]);

	let code_buf = Buffer.alloc(4);
	code_buf.writeUInt32BE(code);
	code_buf = code_buf.slice(1, 4);

	let uid_byte_list = [];
	for (let i = 0; i < uid.length; i += 2) {
		let h = uid.substr(i, 1) + uid.substr(i + 1, 1);
		let d = parseInt(h, 16);
		uid_byte_list.push(d);
	}
	let pad_len = 13 - uid_byte_list.length;
	for (let i = 0; i < pad_len; i++) {
		uid_byte_list.push(0);
	}
	let uid_buf = Buffer.from(uid_byte_list);

	let buf = Buffer.concat([protocol_buf, code_buf, uid_buf]);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
