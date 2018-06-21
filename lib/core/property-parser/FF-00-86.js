/* ------------------------------------------------------------------
* node-echonet-lite - FF-00-86.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : FF : Super Class Group
* - Class code       : 00 : Device Object Super Class
* - EPC              : 86 : Manufacturer’s fault code
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'LEN': {
				'field': 'Data size of the fault code field',
				'values': {}
			},
			'MAC': {
				'field': 'Manufacturer code',
				'value': {}
			},
			'FAC': {
				'field': 'Manufacturer-defined fault code',
				'value': {}
			}
		},
		'ja': {
			'LEN': {
				'field': '異常コード部のデータサイズ',
				'values': {}
			},
			'MAC': {
				'field': 'メーカコード',
				'value': {}
			},
			'FAC': {
				'field': '各メーカ独自の異常コード部',
				'value': {}
			}
		},
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
	if(buf.length < 5 || buf.length > 225) {
		return null;
	}

	// Data size of the fault code field
	var len_buf = buf.slice(0, 1);
	var len_key = 'LEN';
	var len_value = len_buf.readUInt8(0);
	var len = {
		'key'   : len_key,
		'field' : this.desc[len_key]['field'],
		'value' : len_value,
		'buffer': len_buf,
		'hex'   : mBuffer.convBufferToHexString(len_buf),
		'desc'  : len_value.toString()
	};
	structure.push(len);

	// Manufacturer code
	var mac_buf = buf.slice(1, 4);
	var mac_key = 'MAC';
	var mac_value = Buffer.concat([Buffer.from([0x00]), mac_buf]).readUInt32BE(0);
	var mac_hex = mBuffer.convBufferToHexString(mac_buf);
	var mac_desc = mac_hex.join(' ');
	var mac = {
		'key'   : mac_key,
		'field' : this.desc[mac_key]['field'],
		'value' : mac_value,
		'buffer': mac_buf,
		'hex'   : mac_hex,
		'desc'  : mac_desc
	};
	structure.push(mac);

	// Manufacturer-defined fault code
	var fac_buf = buf.slice(4, buf.length);
	var fac_key = 'FAC';
	var fac_hex = mBuffer.convBufferToHexString(fac_buf);
	var fac_desc = fac_hex.join(' ');
	var len = {
		'key'   : fac_key,
		'field' : this.desc[fac_key]['field'],
		'buffer': fac_buf,
		'hex'   : fac_hex,
		'desc'  : fac_desc
	};
	structure.push(len);

	var parsed = {
		'message': {
			'manufacturer': mac_value,
			'fault': fac_desc
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}

	var manufacturer = data['manufacturer'];
	if(typeof(manufacturer) !== 'number' || manufacturer < 0 || manufacturer > 16777215 || manufacturer % 1 > 0) {
		throw new Error('The "manufacturer" property in the 1st argument "data" is invalid.');
	}

	var fault = data['fault'];
	if(typeof(fault) !== 'string') {
		throw new Error('The "manufacturer" property in the 1st argument "data" is invalid.');
	} else {
		fault = fault.replace(/\s/g, '');
		if(fault === '' || !fault.match(/^[a-zA-Z0-9]+$/) || fault.length % 2 !== 0) {
			throw new Error('The "manufacturer" property in the 1st argument "data" is invalid.');
		}
	}

	var len_buf = Buffer.alloc(1);
	var fault_byte_num = fault.length / 2;
	len_buf.writeUInt8(fault_byte_num);

	var man_buf = Buffer.alloc(4);
	man_buf.writeUInt32BE(manufacturer);
	man_buf = man_buf.slice(1, 4);

	var fault_buf = Buffer.alloc(fault_byte_num);
	for(var i=0; i<fault_byte_num; i++) {
		fault_buf.writeUInt8(parseInt(fault.substr(i*2, 2), 16), i);
	}

	return Buffer.concat([len_buf, man_buf, fault_buf]);
};

module.exports = new EchonetLitePropertyParser();
