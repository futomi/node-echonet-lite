/* ------------------------------------------------------------------
* node-echonet-lite - 01-30-CD.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 01 : Air conditioner-related device class group
* - Class code       : 30 : Home air conditioner class
* - EPC              : CD : Operation status of components
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'CPS': {
				'field': 'Compressor',
				'values': {
					0: 'Not operating',
					1: 'In operation'
				}
			},
			'THM': {
				'field': 'Thermostat',
				'values': {
					0: 'OFF',
					1: 'ON'
				}
			}
		},
		'ja': {
			'CPS': {
				'field': 'Compressor',
				'values': {
					0: '停止中',
					1: '動作中'
				}
			},
			'THM': {
				'field': 'Thermostat',
				'values': {
					0: 'OFF',
					1: 'ON'
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

	// Compressor
	var cps_key = 'CPS';
	var cps_value = ref_value & 0b00000001;
	var cps_buf = Buffer.from([cps_value]);
	var cps_desc = this.desc[cps_key]['values'][cps_value];
	var cps = {
		'key'   : cps_key,
		'field' : this.desc[cps_key]['field'],
		'value' : cps_value,
		'buffer': cps_buf,
		'hex'   : mBuffer.convBufferToHexString(cps_buf),
		'desc'  : cps_desc
	};
	structure.push(cps);

	// Thermostat
	var thm_key = 'THM';
	var thm_value = (ref_value & 0b00000010) >> 1;
	var thm_buf = Buffer.from([thm_value]);
	var thm_desc = this.desc[thm_key]['values'][thm_value];
	var thm = {
		'key'   : thm_key,
		'field' : this.desc[thm_key]['field'],
		'value' : thm_value,
		'buffer': thm_buf,
		'hex'   : mBuffer.convBufferToHexString(thm_buf),
		'desc'  : thm_desc
	};
	structure.push(thm);

	var parsed = {
		'message': {
			'compressor': cps_value ? true : false, 
			'thermostat': thm_value ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}

	var compressor = data['compressor'];
	if(typeof(compressor) !== 'boolean') {
		throw new Error('The "compressor" property in the 1st argument "data" is invalid.');
	}

	var thermostat = data['thermostat'];
	if(typeof(thermostat) !== 'boolean') {
		throw new Error('The "thermostat" property in the 1st argument "data" is invalid.');
	}

	var bin = (thermostat ? '1' : '0') + (compressor ? '1' : '0');
	var value = parseInt(bin, 2);

	var buf = Buffer.alloc(1);
	buf.writeInt8(value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
