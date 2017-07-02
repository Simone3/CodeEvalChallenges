"use strict";

const FROM     = 1,
      TO       = 12,
	  COL_SIZE = 4;

var Chall = {};

Chall.main = function() {

	for(var i = FROM; i <= TO; i++) {
		
		var line = "";
		
		for(var j = i; j <= TO * i; j = j + i) {
			
			line = line.concat(repeat(" ", COL_SIZE - j.toString().length));
			line = line.concat(j);
		}
		
		console.log(line);
	}
};

function repeat(character, times) {
	
	var result = "";
	
	for(var i=0; i<times; i++) {
		
		result = result.concat(character);
	}
	
	return result;
}

// Chall.main();                 /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */