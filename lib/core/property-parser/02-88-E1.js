/* ------------------------------------------------------------------
* node-echonet-lite - 02-88-E1.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-02
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 88 : Low voltage smart electric energy meter class
* - EPC              : E1 : Unit for cumulative amounts of electric energy (normal and reverse directions)
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'UNT': {
				'field': 'Unit',
				'values': {}
			}
		},
		'ja': {
			'UNT': {
				'field': '単位',
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
	if(buf.length !== 1) {
		return null;
	}
	// Unit
	var unt_buf = buf.slice(0, 1);
	var unt_key = 'UNT';
	var unt_value = unt_buf.readUInt8(0);
	var unt_unit = 1;
	if(unt_value === 0x00) {
		unt_unit = 1.0;
	} else if(unt_value === 0x01) {
		unt_unit = 0.1;
	} else if(unt_value === 0x02) {
		unt_unit = 0.01;
	} else if(unt_value === 0x03) {
		unt_unit = 0.001;
	} else if(unt_value === 0x04) {
		unt_unit = 0.0001;
	} else if(unt_value === 0x0A) {
		unt_unit = 10;
	} else if(unt_value === 0x0B) {
		unt_unit = 100;
	} else if(unt_value === 0x0C) {
		unt_unit = 1000;
	} else if(unt_value === 0x0D) {
		unt_unit = 10000;
	} else {
		return null;
	}

	var unt = {
		'key'   : unt_key,
		'field' : this.desc[unt_key]['field'],
		'value' : unt_value,
		'buffer': unt_buf,
		'hex'   : mBuffer.convBufferToHexString(unt_buf),
		'desc'  : unt_unit.toString() + ' kWh'
	};
	structure.push(unt);

	var parsed = {
		'message': {
			'unit': unt_unit
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var unit = data['unit'];
	if(typeof(unit) !== 'number') {
		throw new Error('The "unit" property in the 1st argument "data" is invalid.');
	}
	var unit_value = 0x00;
	if(unit === 1.0) {
		unit_value = 0x00;
	} else if(unit === 0.1) {
		unit_value = 0x01;
	} else if(unit === 0.01) {
		unit_value = 0x02;
	} else if(unit === 0.001) {
		unit_value = 0x03;
	} else if(unit === 0.0001) {
		unit_value = 0x04;
	} else if(unit === 10) {
		unit_value = 0x0A;
	} else if(unit === 100) {
		unit_value = 0x0B;
	} else if(unit === 1000) {
		unit_value = 0x0C;
	} else if(unit === 10000) {
		unit_value = 0x0D;
	} else {
		throw new Error('The "unit" property in the 1st argument "data" is invalid.');
	}

	var buf = new Buffer(1);
	buf.writeUInt8(unit_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
