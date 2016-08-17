/* ------------------------------------------------------------------
* node-echonet-lite - 02-88-D3.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-02
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 88 : Low voltage smart electric energy meter class
* - EPC              : D3 : Coefficient
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'COE': {
				'field': 'Coefficient',
				'values': {}
			}
		},
		'ja': {
			'COE': {
				'field': '係数',
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
	// Coefficient
	var coe_buf = buf.slice(0, 4);
	var coe_key = 'COE';
	var coe_value = coe_buf.readUInt32BE(0);
	var coe = {
		'key'   : coe_key,
		'field' : this.desc[coe_key]['field'],
		'value' : coe_value,
		'buffer': coe_buf,
		'hex'   : mBuffer.convBufferToHexString(coe_buf),
		'desc'  : coe_value.toString()
	};
	structure.push(coe);

	var parsed = {
		'message': {
			'coefficient': coe_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var coefficient = data['coefficient'];
	if(typeof(coefficient) !== 'number' || coefficient < 0 || coefficient > 999999 || coefficient % 1 > 0) {
		throw new Error('The "coefficient" property in the 1st argument "data" is invalid.');
	}
	var buf = new Buffer(4);
	buf.writeUInt32BE(coefficient);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
