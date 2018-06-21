/* ------------------------------------------------------------------
* node-echonet-lite - FF-00-89.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-20
*
* - Class group code : FF : Super Class Group
* - Class code       : 00 : Device Object Super Class
* - EPC              : 89 : Fault content
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('../misc/buffer.js');

var EchonetLitePropertyParser = function() {
	this.lang = 'en';
	this.descs = {
		'en': {
			'FC': {
				'field': 'Fault content',
				'values': {
					0x00: 'No fault',
					0x01: 'Faults that can be recovered from by turning off the power switch and turning it on again or withdrawing and re-inserting the power plug',
					0x02: 'Faults that can be recovered from by pressing the reset button',
					0x03: 'Faults that can be recovered from by changing the way the device is mounted or opening/closing a lid or door',
					0x04: 'Faults that can be recovered from by supplying fuel, water, air, etc.',
					0x05: 'Faults that can be recovered from by cleaning the device (filter etc.)',
					0x06: 'Faults that can be recovered from by changing the battery or cell',
					0x0A: 'Faults that require repair with an abnormal event or the tripping of a safety device',
					0x14: 'Faults that require repair in a switch',
					0x1E: 'Faults that require repair in the sensor system',
					0x3C: 'Faults that require repair in a component such as an actuator',
					0x5A: 'Faults that require repair in a control circuit board',
				}
			}
		},
		'ja': {
			'FC': {
				'field': '異常内容',
				'values': {
					0x00: '異常無し',
					0x01: '運転／電源スイッチを切るかコンセントを抜き再操作で復帰可能な異常',
					0x02: 'リセットボタンを押し再操作で復帰可能な異常',
					0x03: '機器据え付け方法などの変更で復帰可能な異常',
					0x04: '補給で復帰可能な異常',
					0x05: '清掃（フィルターなど）で復帰可能な異常',
					0x06: '電池交換で復帰可能な異常',
					0x0A: '異常現象／安全装置作動で修理が必要な異常',
					0x14: 'スイッチ異常で修理が必要な異常',
					0x1E: 'センサ異常で修理が必要な異常',
					0x3C: '機能部品異常で修理が必要な異常',
					0x5A: '制御基板異常で修理が必要な異常'
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
	if(buf.length !== 2) {
		return null;
	}
	// Fault content
	var fc_buf = buf.slice(0, 2);
	var fc_key = 'FC';
	var fc_value = fc_buf.readUInt8(0);
	var fc_hex = mBuffer.convBufferToHexString(fc_buf);
	var fc1_value = fc_buf.readUInt8(1);
	var fc2_value = fc_buf.readUInt8(0);
	var fc_desc = '';
	if(fc1_value === 0x00 && fc2_value === 0x00) {
		fc_desc = this.desc[fc_key]['values'][fc1_value];
	} else if(fc1_value >= 0x01 && fc1_value <= 0x06 && fc2_value === 0x00) {
		fc_desc = this.desc[fc_key]['values'][fc1_value];
	} else if(fc2_value === 0x00 || (fc2_value >= 0x04 && fc2_value <= 0xFF)) {
		if(fc1_value >= 0x0A && fc1_value <= 0x13) {
			fc_desc = this.desc[fc_key]['values'][0x0A];
		} else if(fc1_value >= 0x14 && fc1_value <= 0x1D) {
			fc_desc = this.desc[fc_key]['values'][0x14];
		} else if(fc1_value >= 0x1E && fc1_value <= 0x3B) {
			fc_desc = this.desc[fc_key]['values'][0x1E];
		} else if(fc1_value >= 0x3C && fc1_value <= 0x59) {
			fc_desc = this.desc[fc_key]['values'][0x3C];
		} else if(fc1_value >= 0x5A && fc1_value <= 0x6E) {
			fc_desc = this.desc[fc_key]['values'][0x5A];
		}
	}
	var fc = {
		'key'   : fc_key,
		'field' : this.desc[fc_key]['field'],
		'value' : fc_value,
		'buffer': fc_buf,
		'hex'   : fc_hex,
		'desc'  : fc_desc
	};
	structure.push(fc);

	var parsed = {
		'message': {
			'desc' : fc_desc,
			'code1': fc1_value,
			'code2': fc2_value
		},
		'structure': structure
	}
	return parsed;
};


EchonetLitePropertyParser.prototype.create = function(data) {
	if(typeof(data) !== 'object') {
		throw new Error('The 1st argument "data" must be an object.');
	}
	var code1 = data['code1'];
	if(typeof(code1) !== 'number' || code1 < 0x00 || code1 > 0xFF) {
		throw new Error('The "code1" property in the 1st argument "data" is invalid.');
	}
	var code2 = data['code2'];
	if(typeof(code2) !== 'number' || code2 < 0x00 || code2 > 0xFF) {
		throw new Error('The "code2" property in the 1st argument "data" is invalid.');
	}

	var buf = Buffer.from([code2, code1]);
	return buf;
};

module.exports = new EchonetLitePropertyParser();
