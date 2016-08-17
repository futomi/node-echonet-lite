/* ------------------------------------------------------------------
* node-echonet-lite - desc.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-07-22
* ---------------------------------------------------------------- */
'use strict';

var EchonetLiteDesc = function() {
	var lang = 'en';
	this.FIELD     = require('./' + lang + '/FIELD.js');
	this.EHD1      = require('./' + lang + '/EHD1.js');
	this.EHD2      = require('./' + lang + '/EHD2.js');
	this.EOJX1     = require('./' + lang + '/EOJX1.js');
	this.EOJX2     = require('./' + lang + '/EOJX2.js');
	this.ESV       = require('./' + lang + '/ESV.js');
	this.EPC       = require('./' + lang + '/EPC.js');
	this.EPC_SUPER = require('./' + lang + '/EPC_SUPER.js');
	this.epcs = {};
};

EchonetLiteDesc.prototype.setLang = function(lang) {
	var lang = (typeof(lang) === 'string' && lang.match(/^(en|ja)$/)) ? lang : 'en';
	if(lang === this.lang) {
		return lang;
	} else {
		this.lang = lang;
		this.FIELD     = require('./' + lang + '/FIELD.js');
		this.EHD1      = require('./' + lang + '/EHD1.js');
		this.EHD2      = require('./' + lang + '/EHD2.js');
		this.EOJX1     = require('./' + lang + '/EOJX1.js');
		this.EOJX2     = require('./' + lang + '/EOJX2.js');
		this.ESV       = require('./' + lang + '/ESV.js');
		this.EPC       = require('./' + lang + '/EPC.js');
		this.EPC_SUPER = require('./' + lang + '/EPC_SUPER.js');
	}
	return lang;
};

EchonetLiteDesc.prototype.getFieldName = function(key) {
	return this.FIELD[key] || '';
};

EchonetLiteDesc.prototype.getEHD1Name = function(ehd1_code) {
	return this.EHD1[ehd1_code] || '';
};

EchonetLiteDesc.prototype.getEHD2Name = function(ehd2_code) {
	return this.EHD2[ehd2_code] || '';
};

EchonetLiteDesc.prototype.getClassGroupName = function(class_group_code) {
	return this.EOJX1[class_group_code] || '';
};

EchonetLiteDesc.prototype.getClassName = function(class_group_code, class_code) {
	if(this.EOJX2[class_group_code]) {
		return this.EOJX2[class_group_code][class_code] || '';
	} else {
		return '';
	}
};

EchonetLiteDesc.prototype.getPropertyName = function(class_group_code, class_code, property_code) {
	var class_specific_props = {};
	if(this.EPC[class_group_code] && this.EPC[class_group_code][class_code]) {
		class_specific_props = this.EPC[class_group_code][class_code];
	}
	if(class_specific_props[property_code]) {
		return class_specific_props[property_code];
	} else if(this.EPC_SUPER[property_code]) {
		return this.EPC_SUPER[property_code];
	} else {
		return '';
	}
};

EchonetLiteDesc.prototype.getESVName = function(esv_code) {
	return this.ESV[esv_code] || '';
};

module.exports = new EchonetLiteDesc();
