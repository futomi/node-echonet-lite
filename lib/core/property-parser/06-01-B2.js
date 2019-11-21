/* ------------------------------------------------------------------
* node-echonet-lite - 06-01-B2.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-11-03
*
* - Class group code : 06 : Audiovisual-related Device Class Group
* - Class code       : 01 : Display class
* - EPC              : B2 : Supported character codes
* ---------------------------------------------------------------- */
'use strict';
const mBuffer = require('../misc/buffer.js');

const EchonetLitePropertyParser = function () {
	this.lang = 'en';
	this.descs = {
		'en': {
			'SCC': {
				'field': 'Supported character codes',
				'values': {}
			}
		},
		'ja': {
			'SCC': {
				'field': '表示可能文字コード',
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
	let structure = [];
	// Check the length of the buffer
	if (buf.length !== 2) {
		return null;
	}
	// Supported character codes
	let scc_buf = buf.slice(0, 2);
	let scc_key = 'SCC';
	let scc_value = scc_buf.readUInt8(1);

	let code_list = [];
	if(scc_value & 0b00000001) {
		code_list.push('ascii');
	}
	if(scc_value & 0b00000010) {
		code_list.push('shift_jis');
	}
	if(scc_value & 0b00000100) {
		code_list.push('jis');
	}
	if(scc_value & 0b00001000) {
		code_list.push('euc-jp');
	}
	if(scc_value & 0b00010000) {
		code_list.push('ucs-4');
	}
	if(scc_value & 0b00100000) {
		code_list.push('ucs-2');
	}
	if(scc_value & 0b01000000) {
		code_list.push('latin-1');
	}
	if(scc_value & 0b10000000) {
		code_list.push('utf-8');
	}

	let scc = {
		'key': scc_key,
		'field': this.desc[scc_key]['field'],
		'value': scc_value,
		'buffer': scc_buf,
		'hex': mBuffer.convBufferToHexString(scc_buf),
		'desc': code_list.join(', ')
	};
	structure.push(scc);

	let parsed = {
		'message': {
			'list': code_list,
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function (data) {
	if (typeof (data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	let list = data['list'];
	if(!Array.isArray(list) || list.length === 0) {
		throw new Error('The "list" must be an array with at least one element.');
	}

	let n = 0;
	list.forEach((c) => {
		if(typeof(c) !== 'string') {
			throw new Error('An element in the "list" is invalid.');
		}
		c = c.toLocaleLowerCase().replace(/[\-\_]/, '');
		if(c === 'ascii') {
			n = n | 0b00000001;
		} else if(c === 'shiftjis') {
			n = n | 0b00000010;
		} else if(c === 'jis') {
			n = n | 0b00000100;
		} else if(c === 'eucjp') {
			n = n | 0b00001000;
		} else if(c === 'ucs4') {
			n = n | 0b00010000;
		} else if(c === 'ucs2') {
			n = n | 0b00100000;
		} else if(c === 'latin1') {
			n = n | 0b01000000;
		} else if(c === 'utf8') {
			n = n | 0b10000000;
		} else {
			throw new Error('An element in the "list" is invalid.');
		}
	});
	let buf = Buffer.alloc(2);
	buf.writeUInt16BE(n, 0);
	return buf;
};


module.exports = new EchonetLitePropertyParser();
