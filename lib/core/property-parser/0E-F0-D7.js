/* ------------------------------------------------------------------
* node-echonet-lite - 0E-F0-D7.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : 0E : Profile class group
* - Class code       : F0 : Node profile class
* - EPC              : D7 : Self-node class list S
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');
var mELDesc = require('../desc/desc.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'NUM': 'Total number of classes'
		},
		'ja': {
			'NUM': 'クラス総数'
		}
	}
	this.desc = this.descs[this.lang];
};

EchonetLitePropertyParser.prototype.setLang = function(lang) {
	this.lang = mELDesc.setLang(lang);
	if(this.descs[lang]) {
		this.desc = this.descs[lang]
	}
	return this.lang;
};

EchonetLitePropertyParser.prototype.parse = function(buf) {
	var structure = [];
	// Total number of classes
	var num_buf = buf.slice(0, 1);
	var num_value = buf.readUInt8(0);
	// Check the length of the buffer
	if(buf.length !== 1 + (num_value * 2)) {
		return null;
	}
	var num_key = 'NUM';
	var num = {
		'key'   : num_key,
		'field' : this.desc[num_key],
		'buffer':  num_buf,
		'hex'   : mBuffer.convBufferToHexString(num_buf),
		'desc'  : num_value.toString()
	};
	structure.push(num);
	// Parse each EOJ
	var instans_list = [];
	for(var offset=1; offset<buf.length; offset+=2) {
		var instance = {};
		// EOJ (ECHONET Lite object specification)
		var eoj_key = 'EOJ';
		var eoj_buf = buf.slice(offset, offset + 3);
		var eoj = {
			'key'      : eoj_key,
			'field'    : mELDesc.getFieldName(eoj_key),
			'buffer'   : eoj_buf,
			'hex'      : mBuffer.convBufferToHexString(eoj_buf),
			'desc'     : '',
			'structure': []
		};
		structure.push(eoj);
		// EOJ X1 (Class group code)
		var eojx1_key = 'EOJX1';
		var eojx1_value = buf.readUInt8(offset);
		var eojx1_buf = buf.slice(offset, offset + 1);
		var eojx1_desc = mELDesc.getClassGroupName(eojx1_value);
		var eojx1 = {
			'key'   : eojx1_key,
			'field' : mELDesc.getFieldName(eojx1_key),
			'value' : eojx1_value,
			'buffer': eojx1_buf,
			'hex'   : mBuffer.convBufferToHexString(eojx1_buf),
			'desc'  : eojx1_desc
		};
		eoj['structure'].push(eojx1);
		// EOJ X2 (Class code)
		var eojx2_key = 'EOJX2';
		var eojx2_value = buf.readUInt8(offset + 1);
		var eojx2_buf = buf.slice(offset + 1, offset + 2);
		var eojx2_desc = mELDesc.getClassName(eojx1_value, eojx2_value);
		var eojx2 = {
			'key'   : eojx2_key,
			'field' : mELDesc.getFieldName(eojx2_key),
			'value' : eojx2_value,
			'buffer': eojx2_buf,
			'hex'   : mBuffer.convBufferToHexString(eojx2_buf),
			'desc'  : eojx2_desc
		};
		eoj['structure'].push(eojx2);

		/*
		instans_list.push({
			'group'     : eojx1_value,
			'group_desc': eojx1_desc,
			'class'     : eojx2_value,
			'class_desc': eojx2_desc
		});
		*/
		instans_list.push([eojx1_value, eojx2_value]);
	}
	var parsed = {
		'message': {
			'list': instans_list
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
	var byte_list = [];
	var num = list.length;
	if(num < 1 || num > 8) {
		throw new Error('The "list" property in the 1st argument "data" is invalid.');
	}
	byte_list.push(num);

	list.forEach((eoj) => {
		if(!eoj || !Array.isArray(eoj) || eoj.length !== 2){
			throw new Error('The "list" property in the 1st argument "data" is invalid.');
		}
		var g = eoj[0];
		var c = eoj[1];
		if(typeof(g) !== 'number' || typeof(c) !== 'number') {
			throw new Error('The "list" property in the 1st argument "data" is invalid.');
		}
		if(g < 0 || g > 0xFF || c < 0 || c > 0xFF) {
			throw new Error('The "list" property in the 1st argument "data" is invalid.');
		}
		byte_list.push(g);
		byte_list.push(c);
	});

	var buf = Buffer.from(byte_list);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
