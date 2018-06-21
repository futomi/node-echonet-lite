/* ------------------------------------------------------------------
* node-echonet-lite - FF-00-9A.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : FF : Super Class Group
* - Class code       : 00 : Device Object Super Class
* - EPC              : 9A : Cumulative operating time
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'ETM': {
				'field': 'Elapsed time',
				'values': {}
			},
			'UNT': {
				'field': 'Unit',
				'values': {
					0x41: 'Second',
					0x42: 'Minute',
					0x43: 'Hour',
					0x44: 'Day'
				}
			}
		},
		'ja': {
			'ETM': {
				'field': '経過時間',
				'values': {}
			},
			'UNT': {
				'field': 'Unit',
				'values': {
					0x41: '秒',
					0x42: '分',
					0x43: '時',
					0x44: '日'
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
	if(buf.length !== 5) {
		return null;
	}

	// Unit
	var unt_buf = buf.slice(0, 1);
	var unt_key = 'UNT';
	var unt_value = unt_buf.readUInt8(0);
	var unt_desc = this.desc[unt_key]['values'][unt_value] || '';
	var unt = {
		'key'   : unt_key,
		'field' : this.desc[unt_key]['field'],
		'value' : unt_value,
		'buffer': unt_buf,
		'hex'   : mBuffer.convBufferToHexString(unt_buf),
		'desc'  : unt_desc
	};
	structure.push(unt);

	// Elapsed time
	var etm_buf = buf.slice(1, 5);
	var etm_key = 'ETM';
	var etm_value = etm_buf.readUInt32BE(0);
	var etm_desc = etm_value.toString() + ' ' + unt_desc;
	var etm = {
		'key'   : etm_key,
		'field' : this.desc[etm_key]['field'],
		'value' : etm_value,
		'buffer': etm_buf,
		'hex'   : mBuffer.convBufferToHexString(etm_buf),
		'desc'  : etm_desc
	};
	structure.push(etm);

	var parsed = {
		'message': {
			'unit': unt_value - 0x40,
			'elapsed': etm_value
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
	if(!unit || typeof(unit) !== 'number' || unit < 0 || unit > 4 || unit % 1 > 0) {
		throw new Error('The "unit" property in the 1st argument "data" is invalid.');
	}

	var elapsed = data['elapsed'];
	if(!elapsed || typeof(elapsed) !== 'number' || elapsed < 0 || elapsed > 4294967295 || elapsed % 1 > 0) {
		throw new Error('The "elapsed" property in the 1st argument "data" is invalid.');
	}

	var buf = Buffer.alloc(5);
	buf.writeUInt8(unit + 0x40, 0);
	buf.writeUInt32BE(elapsed, 1);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
