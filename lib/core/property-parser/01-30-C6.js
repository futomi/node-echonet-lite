/* ------------------------------------------------------------------
* node-echonet-lite - 01-30-C6.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-06
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 30 : Home air conditioner class
* - EPC              : C6 : Mounted air cleaning method
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'DST': {
				'field': 'Electrical dust collection method',
				'values': {
					0: 'Not mounted',
					1: 'Mounted'
				}
			},
			'ION': {
				'field': 'Cluster ion method',
				'values': {
					0: 'Not mounted',
					1: 'Mounted'
				}
			}
		},
		'ja': {
			'DST': {
				'field': '電気集塵方式',
				'values': {
					0: '非搭載',
					1: '搭載'
				}
			},
			'ION': {
				'field': 'クラスタイオン方式',
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

	var acm_buf = buf.slice(0, 1);
	var acm_value = acm_buf.readUInt8(0);

	// Electrical dust collection method
	var dst_key = 'DST';
	var dst_value = acm_value & 0b00000001;
	var dst_buf = new Buffer([dst_value]);
	var dst_desc = this.desc[dst_key]['values'][dst_value];
	var dst = {
		'key'   : dst_key,
		'field' : this.desc[dst_key]['field'],
		'value' : dst_value,
		'buffer': dst_buf,
		'hex'   : mBuffer.convBufferToHexString(dst_buf),
		'desc'  : dst_desc
	};
	structure.push(dst);

	// Cluster ion method
	var ion_key = 'ION';
	var ion_value = (acm_value & 0b00000010) >> 1;
	var ion_buf = new Buffer([ion_value]);
	var ion_desc = this.desc[ion_key]['values'][ion_value];
	var ion = {
		'key'   : ion_key,
		'field' : this.desc[ion_key]['field'],
		'value' : ion_value,
		'buffer': ion_buf,
		'hex'   : mBuffer.convBufferToHexString(ion_buf),
		'desc'  : ion_desc
	};
	structure.push(ion);

	var parsed = {
		'message': {
			'dust': dst_value ? true : false, 
			'ion': ion_value ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}

	var dust = data['dust'];
	if(typeof(dust) !== 'boolean') {
		throw new Error('The "dust" property in the 1st argument "data" is invalid.');
	}

	var ion = data['ion'];
	if(typeof(ion) !== 'boolean') {
		throw new Error('The "ion" property in the 1st argument "data" is invalid.');
	}

	var bin = (ion ? '1' : '0') + (dust ? '1' : '0');
	var value = parseInt(bin, 2);

	var buf = new Buffer(1);
	buf.writeInt8(value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
