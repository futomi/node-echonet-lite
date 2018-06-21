/* ------------------------------------------------------------------
* node-echonet-lite - 02-88-E8.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 02 : Housing/facility-related device class group
* - Class code       : 88 : Low voltage smart electric energy meter class
* - EPC              : E8 : Measured instantaneous currents
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');;

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'CRR': {
				'field': 'R phase',
				'values': {}
			},
			'CRT': {
				'field': 'T phase',
				'values': {}
			}
		},
		'ja': {
			'CRR': {
				'field': 'R相',
				'values': {}
			},
			'CRT': {
				'field': 'T相',
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
	// R phase
	var crr_buf = buf.slice(0, 2);
	var crr_key = 'CRR';
	var crr_value = crr_buf.readInt16BE(0);
	var crr_crrents = crr_value / 10;
	var crr = {
		'key'   : crr_key,
		'field' : this.desc[crr_key]['field'],
		'value' : crr_value,
		'buffer': crr_buf,
		'hex'   : mBuffer.convBufferToHexString(crr_buf),
		'desc'  : crr_crrents.toString() + ' A'
	};
	structure.push(crr);

	// T phase
	var crt_buf = buf.slice(2, 4);
	var crt_key = 'CRT';
	var crt_value = crt_buf.readInt16BE(0);
	var crt_crrents = crt_value / 10;
	var crt = {
		'key'   : crt_key,
		'field' : this.desc[crt_key]['field'],
		'value' : crt_value,
		'buffer': crt_buf,
		'hex'   : mBuffer.convBufferToHexString(crt_buf),
		'desc'  : crt_crrents.toString() + ' A'
	};
	structure.push(crt);

	var parsed = {
		'message': {
			'r': crr_crrents,
			't': crt_crrents
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}

	var r = data['r'];
	if(typeof(r) !== 'number' || r < -3276.7 || r > 3276.5 || (r * 10) % 1 > 0) {
		throw new Error('The "r" property in the 1st argument "data" is invalid.');
	}
	r = r * 10;

	var t = data['t'];
	if(typeof(t) !== 'number' || t < -3276.7 || t > 3276.5 || (t * 10) % 1 > 0) {
		throw new Error('The "t" property in the 1st argument "data" is invalid.');
	}
	t = t * 10;

	var r_buf = Buffer.alloc(2);
	r_buf.writeInt16BE(r);
	var t_buf = Buffer.alloc(2);
	t_buf.writeInt16BE(t);
	var buf = Buffer.concat([r_buf, t_buf]);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
