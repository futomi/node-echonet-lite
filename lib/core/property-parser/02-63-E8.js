/* ------------------------------------------------------------------
* node-echonet-lite - 02-63-E8.js
*
* Copyright (c) 2019, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2019-10-05
*
* - Class group code : 02 : Housing/Facilities-related Device Class Group
* - Class code       : 63 : Electrically operated rain sliding door/shutter class
* - EPC              : E8 : Remote operation setting status
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'ROS': {
				'field': 'Remote operation setting status',
				'values': {
					0x41: 'ON (permitted)',
					0x42: 'OFF (prohibited)'
				}
			}
		},
		'ja': {
			'ROS': {
				'field': '遠隔操作設定状態',
				'values': {
					0x41: 'ON（許可）',
					0x42: 'OFF（禁止）'
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
	// Remote operation setting status
	var ros_buf = buf.slice(0, 1);
	var ros_key = 'ROS';
	var ros_value = ros_buf.readUInt8(0);
	var ros = {
		'key'   : ros_key,
		'field' : this.desc[ros_key]['field'],
		'value' : ros_value,
		'buffer': ros_buf,
		'hex'   : mBuffer.convBufferToHexString(ros_buf),
		'desc'  : this.desc[ros_key]['values'][ros_value]
	};
	structure.push(ros);

	var parsed = {
		'message': {
			'status': (ros_value === 0x41) ? true : false
		},
		'structure': structure
	}
	return parsed;
};

EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var status = data['status'];
	if(typeof(status) !== 'boolean') {
		throw new Error('The "status" property in the 1st argument "data" is invalid.');
	}
	var buf = Buffer.alloc(1);
	var status_value = status ? 0x41 : 0x42;
	buf.writeUInt8(status_value);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
