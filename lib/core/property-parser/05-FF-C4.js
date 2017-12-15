/* ------------------------------------------------------------------
* node-echonet-lite - 05-FF-C4.js
*
* Copyright (c) 2017, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2017-11-29
*
* - Class group code : 05 : Management/Operation-related Device Class Group
* - Class code       : FF : Controller
* - EPC              : C4 : Device type 
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'GRP': {
				'field': 'Class group code',
				'values': {}
			},
			'CLS': {
				'field': 'Class code',
				'values': {}
			}
		},
		'ja': {
			'GRP': {
				'field': 'クラスグループコード',
				'values': {}
			},
			'CLS': {
				'field': 'クラスコード',
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
	if(buf.length !== 2) {
		return null;
	}

	// Class group code
	var grp_key = 'GRP';
	var grp_value = buf.readUInt8(0);
	var grp_buf = new Buffer([grp_value]);
	var grp_desc = grp_buf.toString('hex');
	var grp = {
		'key'   : grp_key,
		'field' : this.desc[grp_key]['field'],
		'value' : grp_value,
		'buffer': grp_buf,
		'hex'   : mBuffer.convBufferToHexString(grp_buf),
		'desc'  : grp_desc
	};
	structure.push(grp);

	// Class code
	var cls_key = 'CLS';
	var cls_value = buf.readUInt8(1);
	var cls_buf = new Buffer([cls_value]);
	var cls_desc = cls_buf.toString('hex');
	var cls = {
		'key'   : cls_key,
		'field' : this.desc[cls_key]['field'],
		'value' : cls_value,
		'buffer': cls_buf,
		'hex'   : mBuffer.convBufferToHexString(cls_buf),
		'desc'  : cls_desc
	};
	structure.push(cls);

	var parsed = {
		'message': {
			'group': grp_value,
			'class': cls_value
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument `data` must be an object.');
	}

	var grp = data['group'];
	if(!('group' in data)) {
		throw new Error('The `group` is required.');
	} else if(typeof(grp) !== 'number') {
		throw new Error('The `group` must be an integer between 0x00 and 0xFF.');
	} else if(grp % 1 !== 0) {
		throw new Error('The `group` must be an integer between 0x00 and 0xFF.');
	} else if(grp < 0 || grp > 0xFF) {
		throw new Error('The `group` must be an integer between 0x00 and 0xFF.');
	}

	var cls = data['class'];
	if(!('class' in data)) {
		throw new Error('The `class` is required.');
	} else if(typeof(cls) !== 'number') {
		throw new Error('The `class` must be an integer between 0x00 and 0xFF.');
	} else if(cls % 1 !== 0) {
		throw new Error('The `class` must be an integer between 0x00 and 0xFF.');
	} else if(cls < 0 || cls > 0xFF) {
		throw new Error('The `class` must be an integer between 0x00 and 0xFF.');
	}

	var buf = Buffer.from([grp, cls]);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
