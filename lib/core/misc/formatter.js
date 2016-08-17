/* ------------------------------------------------------------------
* node-echonet-lite - formatter.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-08-02
* ---------------------------------------------------------------- */
'use strict';

var EchonetLiteFormatter = function() {};

EchonetLiteFormatter.prototype.format = function(structure, indent_level) {
	if(!indent_level) {
		indent_level = 0;
	}
	var line_list = [];
	structure.forEach((blk) => {
		var key = this._createIndent(indent_level) + '- ' + blk['key'];
		var field = blk['field'];
		var hex = blk['hex'].join(' ');
		var desc = blk['desc'] || hex;
		var cols = [key, field, hex, desc];
		var w = [12, 32, 5];
		var line = this._formatLineColmns(cols, w, indent_level);
		line_list.push(line);
		if(blk['structure']) {
			line_list.push(this.format(blk['structure'], indent_level + 1));
		}
	});
	return line_list.join('\n');
};

EchonetLiteFormatter.prototype._formatLineColmns = function(cols, w) {
	var formated_cols = [];
	for(var i=0; i<cols.length; i++) {
		formated_cols.push(this._spacePaddingRight(cols[i], w[i]));
	}
	var line = formated_cols.join('|');
	/*
	if(line.length > process.stdout.columns) {
		line = this._spacePaddingRight(line, process.stdout.columns - 2);
	}
	*/
	return line;
};

EchonetLiteFormatter.prototype._createIndent = function(indent_level) {
	var indent = '';
	for(var i=0; i<indent_level; i++) {
		indent += '  ';
	}
	return indent;
};

EchonetLiteFormatter.prototype._spacePaddingRight = function(str, len) {
	if(!len) {
		return str;
	}
	var str_len = 0;
	var char_list = str.split('');
	var char_data_list = [];
	char_list.forEach((c) => {
		var char_len = c.match(/^[\x20-\x7e]$/) ? 1 : 2;
		str_len += char_len;
		char_data_list.push([c, char_len]);
	});
	if(str_len === len) {
		return str;
	} else if(str_len > len) {
		var truncated = '';
		var truncated_len = 0;
		for(var i=0, str_len=char_data_list.length-1; i<str_len; i++) {
			var char_data = char_data_list[i];
			truncated += char_data[0];
			truncated_len += char_data[1];
			var char_next_data = char_data_list[i+1];
			if(truncated_len + char_next_data[1] + 2 > len) {
				truncated += '..'
				var snum = len - truncated_len - 2;
				for(var i=0; i<snum; i++) {
					truncated += ' ';
				}
				return truncated;
			}
		}
	} else {
		var snum = len - str_len;
		for(var i=0; i<snum; i++) {
			str += ' ';
		}
		return str;
	}
};

module.exports = new EchonetLiteFormatter();
