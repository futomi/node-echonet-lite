/* ------------------------------------------------------------------
* node-echonet-lite - 01-30-C8.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 30 : Home air conditioner class
* - EPC              : C8 : Mounted air refresh method
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'MNS': {
				'field': 'Minus ion',
				'values': {
					0: 'Not mounted',
					1: 'Mounted'
				}
			},
			'CLT': {
				'field': 'Cluster ion',
				'values': {
					0: 'Not mounted',
					1: 'Mounted'
				}
			}
		},
		'ja': {
			'MNS': {
				'field': 'マイナスイオン',
				'values': {
					0: '非搭載',
					1: '搭載'
				}
			},
			'CLT': {
				'field': 'クラスタイオン',
				'values': {
					0: '非搭載',
					1: '搭載'
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
	if(buf.length !== 1) {
		return null;
	}
	var ref_value = buf.readUInt8(0);

	// Minus ion
	var mns_key = 'MNS';
	var mns_value = ref_value & 0b00000001;
	var mns_buf = Buffer.from([mns_value]);
	var mns_desc = this.desc[mns_key]['values'][mns_value];
	var mns = {
		'key'   : mns_key,
		'field' : this.desc[mns_key]['field'],
		'value' : mns_value,
		'buffer': mns_buf,
		'hex'   : mBuffer.convBufferToHexString(mns_buf),
		'desc'  : mns_desc
	};
	structure.push(mns);

	// Cluster ion
	var clt_key = 'CLT';
	var clt_value = (ref_value & 0b00000010) >> 1;
	var clt_buf = Buffer.from([clt_value]);
	var clt_desc = this.desc[clt_key]['values'][clt_value];
	var clt = {
		'key'   : clt_key,
		'field' : this.desc[clt_key]['field'],
		'value' : clt_value,
		'buffer': clt_buf,
		'hex'   : mBuffer.convBufferToHexString(clt_buf),
		'desc'  : clt_desc
	};
	structure.push(clt);

	var parsed = {
		'message': {
			'minus'  : mns_value ? true : false, 
			'cluster': clt_value ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}

	var minus = data['minus'];
	if(typeof(minus) !== 'boolean') {
		throw new Error('The "minus" property in the 1st argument "data" is invalid.');
	}

	var cluster = data['cluster'];
	if(typeof(cluster) !== 'boolean') {
		throw new Error('The "cluster" property in the 1st argument "data" is invalid.');
	}

	var bin = (cluster ? '1' : '0') + (minus ? '1' : '0');
	var value = parseInt(bin, 2);

	var buf = Buffer.alloc(1);
	buf.writeInt8(value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
