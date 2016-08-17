/* ------------------------------------------------------------------
* node-echonet-lite - 01-30-CA.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-06
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 30 : Home air conditioner class
* - EPC              : CA : Mounted self-cleaning method
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'OZN': {
				'field': 'Ozone cleaning method',
				'values': {
					0: 'Not mounted',
					1: 'Mounted'
				}
			},
			'DRY': {
				'field': 'Drying method',
				'values': {
					0: 'Not mounted',
					1: 'Mounted'
				}
			}
		},
		'ja': {
			'OZN': {
				'field': 'オゾン洗浄方式',
				'values': {
					0: '非搭載',
					1: '搭載'
				}
			},
			'DRY': {
				'field': '乾燥方式',
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

	// Ozone cleaning method
	var ozn_key = 'OZN';
	var ozn_value = ref_value & 0b00000001;
	var ozn_buf = new Buffer([ozn_value]);
	var ozn_desc = this.desc[ozn_key]['values'][ozn_value];
	var ozn = {
		'key'   : ozn_key,
		'field' : this.desc[ozn_key]['field'],
		'value' : ozn_value,
		'buffer': ozn_buf,
		'hex'   : mBuffer.convBufferToHexString(ozn_buf),
		'desc'  : ozn_desc
	};
	structure.push(ozn);

	// Drying method
	var dry_key = 'DRY';
	var dry_value = (ref_value & 0b00000010) >> 1;
	var dry_buf = new Buffer([dry_value]);
	var dry_desc = this.desc[dry_key]['values'][dry_value];
	var dry = {
		'key'   : dry_key,
		'field' : this.desc[dry_key]['field'],
		'value' : dry_value,
		'buffer': dry_buf,
		'hex'   : mBuffer.convBufferToHexString(dry_buf),
		'desc'  : dry_desc
	};
	structure.push(dry);

	var parsed = {
		'message': {
			'ozone'  : ozn_value ? true : false, 
			'drying': dry_value ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}

	var ozone = data['ozone'];
	if(typeof(ozone) !== 'boolean') {
		throw new Error('The "ozone" property in the 1st argument "data" is invalid.');
	}

	var drying = data['drying'];
	if(typeof(drying) !== 'boolean') {
		throw new Error('The "drying" property in the 1st argument "data" is invalid.');
	}

	var bin = (drying ? '1' : '0') + (ozone ? '1' : '0');
	var value = parseInt(bin, 2);

	var buf = new Buffer(1);
	buf.writeInt8(value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
