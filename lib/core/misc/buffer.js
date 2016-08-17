/* ------------------------------------------------------------------
* node-echonet-lite - buffer.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-01
* ---------------------------------------------------------------- */
'use strict';

var EchonetLiteBuffer = function() {};

EchonetLiteBuffer.prototype.convDecToHexString = function(dec) {
	var h = dec.toString(16);
	h = ('0' + h).slice(-2);
	return h.toUpperCase();
};

EchonetLiteBuffer.prototype.convBufferToHexString = function(buf) {
	var len = buf.length;
	var hex_list = [];
	for(var i=0; i<len; i++) {
		var dec = buf.readUInt8(i);
		var hex = this.convDecToHexString(dec);
		hex_list.push(hex);
	}
	return hex_list;
};

module.exports = new EchonetLiteBuffer();
