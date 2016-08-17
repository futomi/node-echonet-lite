/* ------------------------------------------------------------------
* node-echonet-lite - FF-00-property-map.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-02
*
* - Class group code : FF    : Super Class Group
* - Class code       : 00    : Device Object Super Class
* - EPC              : 9B-9F : Property map
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');
var mELDesc = require('../desc/desc.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'NUM': {
				'field': 'Number of properties',
				'values': {}
			},
			'EPC': {
				'field': 'Property codes',
				'values': {}
			}
		},
		'ja': {
			'NUM': {
				'field': 'プロパティ数',
				'values': {}
			},
			'EPC': {
				'field': 'プロパティコード',
				'values': {}
			}
		}
	}
};

EchonetLitePropertyParser.prototype.setLang = function(lang) {
	this.lang = mELDesc.setLang(lang);
	if(this.descs[lang]) {
		this.desc = this.descs[lang]
	}
	return this.lang;
};

EchonetLitePropertyParser.prototype.parse = function(buf, group_code, class_code) {
	var structure = [];
	// Check the length of the buffer
	if(buf.length < 1 ||buf.length > 17) {
		return null;
	}
	// Number of properties
	var num_buf = buf.slice(0, 1);
	var num_key = 'NUM';
	var num_value = num_buf.readUInt8(0);
	var num = {
		'key'   : num_key,
		'field' : this.desc[num_key]['field'],
		'value' : num_value,
		'buffer': num_buf,
		'hex'   : mBuffer.convBufferToHexString(num_buf),
		'desc'  : num_value.toString()
	};
	structure.push(num);
	// Property codes
	var epc_buf = buf.slice(1, buf.length);
	var epc_key = 'EPC';
	var epc = {
		'key'   : epc_key,
		'field' : this.desc[epc_key]['field'],
		'buffer': epc_buf,
		'hex'   : mBuffer.convBufferToHexString(epc_buf)
	};
	structure.push(epc);

	var epc_list = [];
	if(num_value < 16) {
		var s = [];
		for(var i=0; i<epc_buf.length; i++) {
			var code_buf = epc_buf.slice(i, i+1);
			var code_value = code_buf.readUInt8(0);
			var code_hex =  mBuffer.convBufferToHexString(code_buf);
			s.push({
				'key'   : epc_key + i,
				'field' : epc_key + i,
				'buffer': code_buf,
				'hex'   : code_hex,
				'desc'  : mELDesc.getPropertyName(group_code, class_code, code_value)
			});
			epc_list.push(code_value);
		}
		epc['structure'] = s;
	} else {
		var s = [];
		var upper_list = ['F', 'E', 'D', 'C', 'B', 'A', '9', '8'];
		var i = 0;
		for(var lower=0; lower<epc_buf.length; lower++) {
			var bin = epc_buf.readUInt8(lower).toString(2);
			bin = ('0000000' + bin).slice(-8);
			for(var upper=0; upper<8; upper++) {
				var bit = parseInt(bin.substr(upper, 1), 10);
				if(bit) {
					var hex = upper_list[upper] + lower.toString(16).toUpperCase();
					var code_value = parseInt(hex, 16);
					var code_buf = new Buffer([code_value]);
					var code_hex = mBuffer.convBufferToHexString(code_buf);
					s.push({
						'key'   : epc_key + i,
						'field' : epc_key + i,
						'buffer': code_buf,
						'hex'   : code_hex,
						'desc'  : mELDesc.getPropertyName(group_code, class_code, code_value)
					});
					epc_list.push(code_value);
					i++;
				}
			}
		}
		epc['structure'] = s;
	}

	var parsed = {
		'message': {
			'list': epc_list
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var list = data['list'];
	if(!list || !Array.isArray(list)) {
		throw new Error('The "list" property in the 1st argument "data" is invalid.');
	}
	var list_num = list.length;
	if(list_num < 1 || list_num > 136) {
		throw new Error('The "list" property in the 1st argument "data" is invalid.');
	}
	for(var i=0; i<list_num; i++) {
		var epc = list[i];
		if(typeof(epc) !== 'number' || epc < 0x00 || epc > 0xFF) {
			throw new Error('An invalid EPC was found.');
		}
	}

	var num_buf = new Buffer([list_num]);
	var list_buf = null;
	if(list_num < 16) {
		list_buf = new Buffer(list);
	} else {
		var byte_value_list = [];
		for(var byte_pos=0; byte_pos<=0xF; byte_pos++) {
			var byte = 0;
			for(var bit_pos=0xF; bit_pos>=0x8; bit_pos--) {
				var epc = bit_pos * 16 + byte_pos;
				if(list.indexOf(epc) !== -1) {
					byte = byte | (1 << (bit_pos - 0x8));
				}
			}
			byte_value_list.push(byte);
		}
		list_buf = new Buffer(byte_value_list);
	}
	var buf = Buffer.concat([num_buf, list_buf]);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
