"use strict";

const fs = require("fs");

var Chall = {};

Chall.main = function(inputFileName) {

	var lines = fs.readFileSync(inputFileName).toString().split("\n");

	linesLoop:
	for(var i = 0; i < lines.length; i++) {

		if(lines[i]) {
			
			var numbers = lines[i].split(",");
			numbers[numbers.length-1] = numbers[numbers.length-1].replace("\r", "");
			var majorElementThreshold = numbers.length / 2;
			
			var counters = {};
			
			for(var j = 0; j < numbers.length; j++) {
				
				var number = numbers[j];
				var value = counters[number];
				
				if(value) {

					value++;
					
					if(value >= majorElementThreshold) {
						
						console.log(number);
						continue linesLoop;
					}
					
					counters[number] = value;
				}
				else {
					
					counters[number] = 1;
				}
			}
			
			console.log("None");
		}
	}
};

// Chall.main(process.argv[2]);   /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */