/* ------------------------------------------------------------------
* node-echonet-lite - core.js
*
* Copyright (c) 2016-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-06-21
* ---------------------------------------------------------------- */
'use strict';
var mBuffer      = require('./misc/buffer.js');
var mELFormatter = require('./misc/formatter.js');
var mELDesc      = require('./desc/desc.js');

/* ------------------------------------------------------------------
* Constructor: EchonetLiteCore()
* ---------------------------------------------------------------- */
var EchonetLiteCore = function() {
	this.lang = 'en';
	this.property_parsers = {};
	this.tid = 0;
	this.seoj_default = [0x05, 0xFF, 0x01]; // Management/control-related device class group, Controller class
	this.deoj_default = [0x0E, 0xF0, 0x00]; // Profile class group, Node profile class
	this.esv_keyword_default = 'Get';
	this.esv_keyword_map = {
		'SETI'      : 0x60,
		'SETC'      : 0x61,
		'GET'       : 0x62,
		'INF_REQ'   : 0x63,
		'SETGET'    : 0x6E,
		'SET_RES'   : 0x71,
		'GET_RES'   : 0x72,
		'INF'       : 0x73,
		'INFC'      : 0x74,
		'INFC_RES'  : 0x7A,
		'SETGET_RES': 0x7E,
		'SETI_SNA'  : 0x50,
		'SETC_SNA'  : 0x51,
		'GET_SNA'   : 0x52,
		'INF_SNA'   : 0x53,
		'SETGET_SNA': 0x5F
	};
};

/* ------------------------------------------------------------------
* Method: setLang(lang)
* ---------------------------------------------------------------- */
EchonetLiteCore.prototype.setLang = function(lang) {
	this.lang = mELDesc.setLang(lang);
	return this.lang;
};

/* ------------------------------------------------------------------
* Method: getClassGroupName(group_code)
* ---------------------------------------------------------------- */
EchonetLiteCore.prototype.getClassGroupName = function(group_code) {
	return mELDesc.getClassGroupName(group_code);
};

/* ------------------------------------------------------------------
* Method: getClassName(group_code, class_code)
* ---------------------------------------------------------------- */
EchonetLiteCore.prototype.getClassName = function(group_code, class_code) {
	return mELDesc.getClassName(group_code, class_code);
};

/* ------------------------------------------------------------------
* Method: getPropertyName(group_code, class_code, epc)
* ---------------------------------------------------------------- */
EchonetLiteCore.prototype.getPropertyName = function(group_code, class_code, epc) {
	return mELDesc.getPropertyName(group_code, class_code, epc);
};

/* ------------------------------------------------------------------
* Method: parse(buf)
* ---------------------------------------------------------------- */
EchonetLiteCore.prototype.parse = function(buf) {
	var structure = [];
	var message = {};

	// EHD1 (ECHONET Lite Header 1)
	var ehd1_key = 'EHD1';
	var ehd1_value = buf.readUInt8(0);
	if(ehd1_value !== 0b00010000) {
		return null;
	}
	var ehd1_buf = buf.slice(0, 1);
	var ehd1 = {
		'key'   : ehd1_key,
		'field' : mELDesc.getFieldName(ehd1_key),
		'value' : ehd1_value,
		'buffer': ehd1_buf,
		'hex'   : mBuffer.convBufferToHexString(ehd1_buf),
		'desc'  : mELDesc.getEHD1Name(ehd1_value)
	};
	structure.push(ehd1);

	// EHD2 (ECHONET Lite Header 2)
	var ehd2_key = 'EHD2';
	var ehd2_value = buf.readUInt8(1);
	if(ehd2_value !== 0x81) {
		return null;
	}
	var ehd2_buf = buf.slice(1, 2);
	var ehd2 = {
		'key'   : ehd2_key,
		'field' : mELDesc.getFieldName(ehd2_key),
		'value' : ehd2_value,
		'buffer': ehd2_buf,
		'hex'   : mBuffer.convBufferToHexString(ehd2_buf),
		'desc'  : mELDesc.getEHD2Name(ehd2_value)
	};
	structure.push(ehd2);

	// TID (Transaction ID)
	var tid_key = 'TID';
	var tid_value = buf.readUInt16BE(2);
	var tid_buf = buf.slice(2, 4);
	var tid = {
		'key'   : tid_key,
		'field' : mELDesc.getFieldName(tid_key),
		'value' : tid_value,
		'buffer': tid_buf,
		'hex'   : mBuffer.convBufferToHexString(tid_buf),
		'desc'  : tid_value.toString()
	};
	structure.push(tid);
	message['tid'] = tid_value;

	// SEOJ (Source ECHONET Lite object specification)
	var seoj_key = 'SEOJ';
	var seoj_buf = buf.slice(4, 7);
	var seoj = {
		'key'      : seoj_key,
		'field'    : mELDesc.getFieldName(seoj_key),
		'buffer'   : seoj_buf,
		'hex'      : mBuffer.convBufferToHexString(seoj_buf),
		'desc'     : '',
		'structure': []
	};
	structure.push(seoj);
	message['seoj'] = [];

	// SEOJ X1 (Source Class group code)
	var seojx1_key = 'SEOJX1';
	var seojx1_value = buf.readUInt8(4);
	var seojx1_buf = buf.slice(4, 5);
	var seojx1 = {
		'key'   : seojx1_key,
		'field' : mELDesc.getFieldName(seojx1_key),
		'value' : seojx1_value,
		'buffer': seojx1_buf,
		'hex'   : mBuffer.convBufferToHexString(seojx1_buf),
		'desc'  : mELDesc.getClassGroupName(seojx1_value)
	};
	seoj['structure'].push(seojx1);
	message['seoj'].push(seojx1_value);

	// SEOJ X2 (Source Class code)
	var seojx2_key = 'SEOJX2';
	var seojx2_value = buf.readUInt8(5);
	var seojx2_buf = buf.slice(5, 6);
	var seojx2 = {
		'key'   : seojx2_key,
		'field' : mELDesc.getFieldName(seojx2_key),
		'value' : seojx2_value,
		'buffer': seojx2_buf,
		'hex'   : mBuffer.convBufferToHexString(seojx2_buf),
		'desc'  : mELDesc.getClassName(seojx1_value, seojx2_value)
	};
	seoj['structure'].push(seojx2);
	message['seoj'].push(seojx2_value);

	// SEOJ X3 (Source Instance code)
	var seojx3_key = 'SEOJX3';
	var seojx3_value = buf.readUInt8(6);
	var seojx3_buf = buf.slice(6, 7);
	var seojx3 = {
		'key'   : seojx3_key,
		'field' : mELDesc.getFieldName(seojx3_key),
		'value' : seojx3_value,
		'buffer': seojx3_buf,
		'hex'   : mBuffer.convBufferToHexString(seojx3_buf),
		'desc'  : seojx3_value.toString()
	};
	seoj['structure'].push(seojx3);
	message['seoj'].push(seojx3_value);

	// DEOJ (Destination ECHONET Lite object specification)
	var deoj_key = 'DEOJ';
	var deoj_buf = buf.slice(7, 10);
	var deoj = {
		'key'      : deoj_key,
		'field'    : mELDesc.getFieldName(deoj_key),
		'buffer'   : deoj_buf,
		'hex'      : mBuffer.convBufferToHexString(deoj_buf),
		'desc'     : '',
		'structure': []
	};
	structure.push(deoj);
	message['deoj'] = [];
	// DEOJ X1 (Destination Class group code)
	var deojx1_key = 'DEOJX1';
	var deojx1_value = buf.readUInt8(7);
	var deojx1_buf = buf.slice(7, 8);
	var deojx1 = {
		'key'   : deojx1_key,
		'field' : mELDesc.getFieldName(deojx1_key),
		'value' : deojx1_value,
		'buffer': deojx1_buf,
		'hex'   : mBuffer.convBufferToHexString(deojx1_buf),
		'desc'  : mELDesc.getClassGroupName(deojx1_value)
	};
	deoj['structure'].push(deojx1);
	message['deoj'].push(deojx1_value);

	// DEOJ X2 (Destination Class code)
	var deojx2_key = 'DEOJX2';
	var deojx2_value  = buf.readUInt8(8);
	var deojx2_buf = buf.slice(8, 9);
	var deojx2 = {
		'key'   : deojx2_key,
		'field' : mELDesc.getFieldName(deojx2_key),
		'value' : deojx2_value,
		'buffer': deojx2_buf,
		'hex'   : mBuffer.convBufferToHexString(deojx2_buf),
		'desc'  : mELDesc.getClassName(deojx1_value, deojx2_value)
	};
	deoj['structure'].push(deojx2);
	message['deoj'].push(deojx2_value);

	// DEOJ X3 (Destination Instance code)
	var deojx3_key = 'DEOJX3';
	var deojx3_value = buf.readUInt8(9);
	var deojx3_buf = buf.slice(9, 10);
	var deojx3 = {
		'key'   : deojx3_key,
		'field' : mELDesc.getFieldName(deojx3_key),
		'value' : deojx3_value,
		'buffer': deojx3_buf,
		'hex'   : mBuffer.convBufferToHexString(deojx3_buf),
		'desc'  : deojx3_value.toString()
	};
	structure.push(deojx3);
	deoj['structure'].push(deojx3);
	message['deoj'].push(deojx3_value);

	// ESV (ECHONET Lite service)
	var esv_key = 'ESV';
	var esv_value = buf.readUInt8(10);
	var esv_buf = buf.slice(10, 11);
	var esv = {
		'key'   : esv_key,
		'field' : mELDesc.getFieldName(esv_key),
		'value' : esv_value,
		'buffer': esv_buf,
		'hex'   : mBuffer.convBufferToHexString(esv_buf),
		'desc'  : mELDesc.getESVName(esv_value)
	};
	structure.push(esv);
	message['esv'] = this._getEsvKyeword(esv_value);

	// OPC (Number of processing properties)
	var opc_key = 'OPC';
	var opc_value = buf.readUInt8(11);
	var opc_buf = buf.slice(11, 12);
	var opc = {
		'key'   : opc_key,
		'field' : mELDesc.getFieldName(opc_key),
		'value' : opc_value,
		'buffer': opc_buf,
		'hex'   : mBuffer.convBufferToHexString(opc_buf),
		'desc'  : opc_value.toString()
	};
	structure.push(opc);
	// Processing Properties
	var offset = 12;
	var property_list = [];
	message['prop'] = [];
	for(var i=0; i<opc_value; i++) {
		// EPC (ECHONET Lite Property)
		var epc_key = 'EPC' + i;
		var epc_value = buf.readUInt8(offset);
		var epc_buf = buf.slice(offset, offset + 1);
		var epc_desc = '';
		if(esv_value >= 0x60 && esv_value <= 0x6F) {
			// ESV Codes for Request
			epc_desc = mELDesc.getPropertyName(deojx1_value, deojx2_value, epc_value)
		} else {
			// ESV Codes for Response/Notification
			epc_desc = mELDesc.getPropertyName(seojx1_value, seojx2_value, epc_value)
		}
		var epc = {
			'key'   : epc_key,
			'field' : mELDesc.getFieldName('EPC'),
			'value' : epc_value,
			'buffer': epc_buf,
			'hex'   : mBuffer.convBufferToHexString(epc_buf),
			'desc'  : epc_desc
		};
		structure.push(epc);
		offset += 1;
		// PDC (Property data counter)
		var pdc_key = 'PDC' + i;
		var pdc_value = buf.readUInt8(offset);
		var pdc_buf = buf.slice(offset, offset + 1);
		var pdc = {
			'key'   : pdc_key,
			'field' : mELDesc.getFieldName('PDC'),
			'value' : pdc_value,
			'buffer': pdc_buf,
			'hex'   : mBuffer.convBufferToHexString(pdc_buf),
			'desc'  : ''
		};
		structure.push(pdc);
		offset += 1;
		// EDT (Property value data)
		var parsed_property = null;
		var edt_buf = null;
		if(pdc_value > 0) {
			var edt_key = 'EDT' + i;
			edt_buf = buf.slice(offset, offset + pdc_value);
			var edt = {
				'key'   : edt_key,
				'field' : mELDesc.getFieldName('EDT'),
				'buffer': edt_buf,
				'hex'   : mBuffer.convBufferToHexString(edt_buf),
				'desc'  : ''
			};
			if(esv_value >= 0x60 && esv_value <= 0x6F) {
				// ESV Codes for Request
				parsed_property = this._parsePropertyData(deojx1_value, deojx2_value, epc_value, edt_buf);
			} else {
				// ESV Codes for Response/Notification
				parsed_property = this._parsePropertyData(seojx1_value, seojx2_value, epc_value, edt_buf);
			}

			if(parsed_property) {
				if(parsed_property['structure']) {
					edt['structure'] = parsed_property['structure'];
				}
			}
			structure.push(edt);
			offset += pdc_value;
		}

		message['prop'].push({
			'epc': epc_value,
			'edt': parsed_property ? parsed_property['message'] : null,
			'buffer': edt_buf
		});
	}

	var parsed = {
		'lang'     : this.lang,
		'message'  : message,
		'buffer'   : buf,
		'hex'      : mBuffer.convBufferToHexString(buf),
		'structure': structure,
		'formatted': mELFormatter.format(structure)
	};
	return parsed;
};

EchonetLiteCore.prototype._getEsvKyeword = function(esv) {
	var w = '';
	for(var k in this.esv_keyword_map) {
		if(this.esv_keyword_map[k] === esv) {
			w = k;
			break;
		}
	}
	if(w) {
		return w.replace('SET', 'Set').replace('GET', 'Get').replace('RES', 'Res');
	} else {
		return '';
	}
};

EchonetLiteCore.prototype._parsePropertyData = function(group_code, class_code, epc, edt_buf) {
	var parser = this._findPropertyDataParser(group_code, class_code, epc);
	if(parser) {
		parser.setLang(this.lang);
		return parser.parse(edt_buf, group_code, class_code);
	} else {
		return null;
	}
};

EchonetLiteCore.prototype._findPropertyDataParser = function(group_code, class_code, epc) {
	var parser = this._getPropertyDataParser(group_code, class_code, epc);
	if(!parser) {
		if(group_code === 0x0E) {
			parser = this._getPropertyDataParser(group_code, 0x00, epc);
		} else {
			parser = this._getPropertyDataParser(0xFF, 0x00, epc);
		}
	}
	return parser;
};

EchonetLiteCore.prototype._getPropertyDataParser = function(group_code, class_code, epc) {
	var module_name = this._getModuleName(group_code, class_code, epc);
	if(module_name in this.property_parsers) {
		return this.property_parsers[module_name];
	} else {
		var parser = null;
		try {
			var fname =  module_name + '.js';
			parser = require('./property-parser/' + fname);
		} catch(e) {
		}
		this.property_parsers[module_name] = parser;
		return parser;
	}
};

EchonetLiteCore.prototype._getModuleName = function(group_code, class_code, epc) {
	var x1 = mBuffer.convDecToHexString(group_code);
	var x2 = mBuffer.convDecToHexString(class_code);
	var x3 = mBuffer.convDecToHexString(epc);
	var module_name = x1 + '-' + x2 + '-' + x3;
	return module_name;
};

/* ------------------------------------------------------------------
* Method: isSupportedEpc(group_code, class_code, epc);
* ---------------------------------------------------------------- */
EchonetLiteCore.prototype.isSupportedEpc = function(group_code, class_code, epc) {
	return this._findPropertyDataParser(group_code, class_code, epc) ? true : false;
};

/* ------------------------------------------------------------------
* Method: create(data)
*
* - Usage:
*	var message = mELCore.create({
*		'tid' : tid,
*		'seoj': [0x05, 0xFF, 0x01],
*		'deoj': [0x0E, 0xF0, 0x00],
*		'esv' : 'Get',
*		'prop': [{'epc': 0xD6, 'edt': null}]
*	});
*
* The properties 'tid', 'seoj', 'deoj', 'esv' are optional.
* If these properteis are not specified, the default values will be
* used. The default values are:
*
*  - tid : a number generated by this module
*  - seoj: [0x05, 0xFF, 0x01] (Management/control-related device class group, Controller class)
*  - deoj: [0x0E, 0xF0, 0x00] (Profile class group, Node profile class)
*  - esv : 'Get'
*
* The property 'edt' can be a Buffer object.
* ---------------------------------------------------------------- */
EchonetLiteCore.prototype.create = function(data) {
	var tid = data['tid'];
	var esv_keyword = data['esv'];
	var seoj = null;
	if(data['seoj']) {
		seoj = JSON.parse(JSON.stringify(data['seoj']));
	}
	var deoj = null;
	if(data['deoj']) {
		deoj = JSON.parse(JSON.stringify(data['deoj']));
	}
	var prop = null;
	if(data['prop']) {
		prop = data['prop'];
	}

	// Check the TID
	if(tid === undefined || tid === null) {
		tid = tid = ++this.tid;
	}
	if(typeof(tid) !== 'number' || tid < 0 || tid > 0xffff || tid % 1 > 0) {
		throw new Error('The value of the "tid" property is invalid.');
	}

	// Check the SEOJ
	if(!seoj) {
		seoj = JSON.parse(JSON.stringify(this.seoj_default));
	}
	if(!Array.isArray(seoj) || seoj.length !== 3) {
		throw new Error('The value of the "seoj" is invalid. (1)');
	} else {
		for(var i=0; i<3; i++) {
			var c = seoj[i];
			if(typeof(c) === 'string' && c.match(/^[0-9a-zA-Z]{2}$/)) {
				c = parseInt(c, 16);
				seoj[i] = c;
			}
			if(typeof(c) !== 'number' || c < 0 || c > 0xFF) {
				throw new Error('The value of the "seoj" property is invalid. (2)');
			}
		}
	}

	// Check the DEOJ
	if(!deoj) {
		deoj = JSON.parse(JSON.stringify(this.deoj_default));
	}
	if(!Array.isArray(deoj) || deoj.length !== 3) {
		throw new Error('The value of the "deoj" is invalid. (1)');
	} else {
		for(var i=0; i<3; i++) {
			var c = deoj[i];
			if(typeof(c) === 'string' && c.match(/^[0-9a-zA-Z]{2}$/)) {
				c = parseInt(c, 16);
				deoj[i] = c;
			}
			if(typeof(c) !== 'number' || c < 0 || c > 0xFF) {
				throw new Error('The value of the "deoj" property is invalid. (2)');
			}
		}
	}

	// Check the ESV
	if(typeof(esv_keyword) !== 'string') {
		esv_keyword = this.esv_keyword_default;
	}
	esv_keyword = esv_keyword.toUpperCase();
	var esv = this.esv_keyword_map[esv_keyword];
	if(!esv) {
		throw new Error('The value of the "esv" property is invalid.');
	}

	// Check the properties
	if(!prop) {
		prop = [];
	}
	if(!Array.isArray(prop)) {
		prop = [prop];
	}
	prop.forEach((o) => {
		if(typeof(o) !== 'object') {
			throw new Error('The value of the "prop" property is invalid. (2)');
		}

		var epc = o['epc'];
		if(!epc) {
			throw new Error('The value of the "prop" property is invalid. (3)');
		}
		if(typeof(epc) === 'string' && epc.match(/^[0-9a-zA-Z]{2}$/)) {
			o['epc'] = parseInt(epc, 16);
		}

		var edt = o['edt'];
		if(!edt) {
			o['edt'] = null;
		}
		if(typeof(edt) !== 'object') {
			throw new Error('The value of the "prop" property is invalid. (4)');
		}
	});

	// Create a Buffer object
	var ehd1_buf = Buffer.from([0b00010000]);
	var ehd2_buf = Buffer.from([0x81]);
	var tid_buf = Buffer.alloc(2);
	tid_buf.writeUInt16BE(tid);
	var seoj_buf = Buffer.from(seoj);
	var deoj_buf = Buffer.from(deoj);
	var esv_buf = Buffer.from([esv]);
	var opc = prop.length;
	var opc_buf = Buffer.from([opc]);
	var buf_list = [ehd1_buf, ehd2_buf, tid_buf, seoj_buf, deoj_buf, esv_buf, opc_buf];
	prop.forEach((o) => {
		var epc = o['epc'];
		var edt = o['edt'];
		var parser = this._findPropertyDataParser(deoj[0], deoj[1], epc);
		if(!parser) {
			var module_name = this._getModuleName(deoj[0], deoj[1], epc);
			throw new Error('The EPC "' + module_name + '" is not supported by this module.');
		}
		var epc_buf = Buffer.from([epc]);
		if(edt) {
			var edt_buf = null;
			if(edt instanceof Buffer) {
				edt_buf = edt;
			} else {
				edt_buf = parser.create(edt);
			}
			var pdc_buf = Buffer.from([edt_buf.length]);
			buf_list.push(epc_buf, pdc_buf, edt_buf);
		} else {
			var pdc_buf = Buffer.from([0x00]);
			buf_list.push(epc_buf, pdc_buf);
		}
	});
	var buf = Buffer.concat(buf_list);
	return buf;
};

module.exports = new EchonetLiteCore();
