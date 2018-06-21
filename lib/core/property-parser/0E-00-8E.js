/* ------------------------------------------------------------------
* node-echonet-lite - 0E-00-8E
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 0E : Profile class group
* - Class code       : 00 : Profile Object Super Class
* - EPC              : 8E : Production date
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'PRD': {
				'field': 'Production date',
				'values': {}
			}
		},
		'ja': {
			'PRD': {
				'field': '製造年月日',
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
	if(buf.length !== 4) {
		return null;
	}
	// Production date
	var prd_buf = buf.slice(0, 4);
	var prd_key = 'PRD';
	var prd_hex = mBuffer.convBufferToHexString(prd_buf);
	var prd_desc= [
		prd_buf.readUInt16BE(0).toString(),
		('0' + prd_buf.readUInt8(2)).slice(-2),
		('0' + prd_buf.readUInt8(3)).slice(-2)
	].join('-');
	var prd = {
		'key'   : prd_key,
		'field' : this.desc[prd_key]['field'],
		'buffer': prd_buf,
		'hex'   : prd_hex,
		'desc'  : prd_desc
	};
	structure.push(prd);

	var parsed = {
		'message': {
			'date': prd_desc
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var date = data['date'];
	if(typeof(date) !== 'string') {
		throw new Error('The "date" property in the 1st argument "data" is invalid.');
	} else if(!date.match(/^\d{4}\-\d{2}\-\d{2}$/)) {
		throw new Error('The "date" property in the 1st argument "data" is invalid.');
	}

	var parts = date.split('-');
	var y = parseInt(parts[0], 10);
	var m = parseInt(parts[1], 10);
	var d = parseInt(parts[2], 10);

	var buf = Buffer.alloc(4);
	buf.writeUInt16BE(y, 0);
	buf.writeUInt8(m, 2);
	buf.writeUInt8(d, 3);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
