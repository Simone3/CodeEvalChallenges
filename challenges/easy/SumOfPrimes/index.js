"use strict";

const HOW_MANY = 1000;

var Chall = {};

Chall.main = function() {
	
	var sum = 2;
	var found = 1;
	var i = 3;

	while(found < HOW_MANY) {
		
		if(isPrime(i)) {
			
			found++;
			sum += i;
		}
		
		i = i + 2;
	}
	console.log(sum);
};

function isPrime(num) {
	
	if(isNaN(num) || !Number.isInteger(num) || num<=1) {
		
		return false;
	}

	if(num <= 3) {
		
		return true;
	}

	if(num % 2 === 0 || num % 3 === 0) {
		
		return false;
	}

	var i = 5;
	var w = 2;
	while(i * i <= num)	{
		
		if(num % i === 0) {
			
			return false;
		} 
		
		i += w;
		w = 6 - w;
	}
	
	return true;
}

// Chall.main();                 /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */