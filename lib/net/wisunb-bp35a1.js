/* ------------------------------------------------------------------
* node-echonet-lite - wisunb-bp35a1.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-13
* ---------------------------------------------------------------- */
'use strict';

/* ------------------------------------------------------------------
* Constructor: EchonetLiteNetWisunbAdapter()
* ---------------------------------------------------------------- */
var EchonetLiteNetWisunbAdapter = function() {};

/* ------------------------------------------------------------------
* Method: createTextSKSCAN()
* ---------------------------------------------------------------- */
EchonetLiteNetWisunbAdapter.prototype.createTextSKSCAN = function() {
	return 'SKSCAN 2 FFFFFFFF 6';
};

/* ------------------------------------------------------------------
* Method: createBufferSKSENDTO(address, el_buf)
* ---------------------------------------------------------------- */
EchonetLiteNetWisunbAdapter.prototype.createBufferSKSENDTO = function(address, el_buf) {
	var byte_num_hex = ('000' + el_buf.length.toString(16)).slice(-4).toUpperCase();
	var cmd_base = 'SKSENDTO 1 ' + address + ' 0E1A 2 ' + byte_num_hex + ' ';
	var cmd_base_buf = new Buffer(cmd_base);
	var cmd_buf = Buffer.concat([cmd_base_buf, el_buf]);
	return cmd_buf;
};

/* ------------------------------------------------------------------
* Method: getELBufferFromResponse(res_text, res_buf)
* ---------------------------------------------------------------- */
EchonetLiteNetWisunbAdapter.prototype.getELBufferFromResponse = function(res_text, res_buf) {
	var parts = res_text.split(' ');
	var offset = 0;
	for(var i=0; i<8; i++) {
		offset += (parts[i].length + 1);
	}
	var len = parseInt(parts[7], 16);
	var el_buf = res_buf.slice(offset, offset + len);
	return el_buf;
};

module.exports = new EchonetLiteNetWisunbAdapter();
