"use strict";

var fs  = require("fs");

var Chall = {};

Chall.main = function(inputFileName) {

	fs.readFileSync(inputFileName).toString().split("\n").forEach(function(line) {

		if(line) {

			var array = line.split(" ");

			var index = array.length - parseInt(array[array.length - 1]) - 1;

			if(index >= 0) {

				console.log(array[index]);
			}
		}
	});
};

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */