"use strict";

const fs = require("fs");

var Chall = {};

Chall.main = function(inputFileName) {

	fs.readFileSync(inputFileName).toString().split("\n").forEach(function(line) {

		if(line) {

			var values = line.split(" ");
			var x = values[0];
			var y = values[1];
			var n = values[2];

			var print = "";

			for(var i = 1; i <= n; i++) {

				var isF = i % x === 0;
				var isB = i % y === 0;
				if(isF && isB) {
					
					print += " FB";
				}
				else if(isF) {
					
					print += " F";
				}
				else if(isB) {
					
					print += " B";
				}
				else {
					
					print += " " + i;
				}
			}

			console.log(print);
		}
	});
};

// Chall.main(process.argv[2]);   /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */