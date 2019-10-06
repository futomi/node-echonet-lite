/* ------------------------------------------------------------------
* node-echonet-lite - 02-63-E3.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-05
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 72 : Instantaneous water heater class
* - EPC              : E3 : Bath auto mode setting
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'BAM': {
				'field': 'Bath auto mode setting',
				'values': {
					0x41: 'Auto ON',
					0x42: 'Auto OFF'
				}
			}
		},
		'ja': {
			'BAM': {
				'field': '風呂自動モード設定',
				'values': {
					0x41: '自動入',
					0x42: '自動解除'
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
	// Bath auto mode setting
	var bam_buf = buf.slice(0, 1);
	var bam_key = 'BAM';
	var bam_value = bam_buf.readUInt8(0);
	var bam_desc = this.desc[bam_key]['values'][bam_value] || '';
	var bam = {
		'key'   : bam_key,
		'field' : this.desc[bam_key]['field'],
		'value' : bam_value,
		'buffer': bam_buf,
		'hex'   : mBuffer.convBufferToHexString(bam_buf),
		'desc'  : bam_desc
	};
	structure.push(bam);

	var parsed = {
		'message': {
			'status': (bam_value === 0x41) ? true : false,
			'desc': bam_desc
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var status = data['status'];
	if(typeof(status) !== 'boolean') {
		throw new Error('The "status" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	var status_value = status ? 0x41 : 0x42;
	buf.writeUInt8(status_value);
	return buf;
};


module.exports = new EchonetLitePropertyParser();
