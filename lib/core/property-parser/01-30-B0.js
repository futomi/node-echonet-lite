/* ------------------------------------------------------------------
* node-echonet-lite - 01-30-B0.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-02
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 30 : Home air conditioner class
* - EPC              : B0 : Operation mode setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'OPM': {
				'field': 'Operation mode',
				'values': {
					0x41: 'Automatic',
					0x42: 'Cooling',
					0x43: 'Heating',
					0x44: 'Dehumidification',
					0x45: 'Air circulator',
					0x40: 'Other'
				}
			}
		},
		'ja': {
			'OPM': {
				'field': '運転モード',
				'values': {
					0x41: '自動',
					0x42: '冷房',
					0x43: '暖房',
					0x44: '除湿',
					0x45: '送風',
					0x40: 'その他'
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
	// Operation mode
	var opm_buf = buf.slice(0, 1);
	var opm_key = 'OPM';
	var opm_value = opm_buf.readUInt8(0);
	var opm_desc = this.desc[opm_key]['values'][opm_value] || '';
	var opm = {
		'key'   : opm_key,
		'field' : this.desc[opm_key]['field'],
		'value' : opm_value,
		'buffer': opm_buf,
		'hex'   : mBuffer.convBufferToHexString(opm_buf),
		'desc'  : opm_desc
	};
	structure.push(opm);

	var parsed = {
		'message': {
			'mode': opm_value - 0x40,
			'desc': opm_desc
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var mode = data['mode'];
	if(typeof(mode) !== 'number' || mode < 0 || mode > 5 || mode % 1 > 0) {
		throw new Error('The "mode" property in the 1st argument "data" is invalid.');
	}
	var mode_value = mode + 0x40;
	var buf = new Buffer(1);
	buf.writeUInt8(mode_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
