/* ------------------------------------------------------------------
* node-echonet-lite - 00-22-E4.js
*
* Copyright (c) 2017, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2017-12-14
*
* - Class group code : 00 : Sensor-related Device Class Group
* - Class code       : 22 : Electric energy sensor class
* - EPC              : E4 : Cumulative amounts of electric energy measurement log
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'LOG': {
				'field': 'Cumulative amounts of electric energy measurement log',
				'values': {}
			}
		},
		'ja': {
			'LOG': {
				'field': '積算電力量計測履歴情報',
				'values': {}
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
	if(buf.length !== 192) {
		return null;
	}
	// Log
	var eng_list = [];
	for(var i=0; i<48; i++) {
		var eng_value = buf.readUInt32BE(i*4); // 0.001kWh
		eng_list.push(eng_value);
	}
	var log_key = 'LOG';
	var log = {
		'key'   : log_key,
		'field' : this.desc[log_key]['field'],
		'value' : eng_list,
		'buffer': buf,
		'hex'   : mBuffer.convBufferToHexString(buf),
		'desc'  : eng_list.join(', ')
	};
	structure.push(log);

	var parsed = {
		'message': {
			'log': eng_list
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument `data` must be an object.');
	}
	var log_list = data['log'];
	if(!Array.isArray(log_list) || log_list.length !== 48) {
		throw new Error('The `log` must be an Array object containing 48 elements.');
	}
	log_list.forEach((eng) => {
		if(typeof(eng) !== 'number' || eng < 0 || eng > 999999999 || eng % 1 !== 0) {
			throw new Error('Each element in the `log` must be an integer between 0 and 999999999.');
		}
	});
	var buf = Buffer.alloc(192);
	log_list.forEach((eng, i) => {
		buf.writeUInt32BE(eng, i*4);
	})
	return buf;
};

module.exports = new EchonetLitePropertyParser();
