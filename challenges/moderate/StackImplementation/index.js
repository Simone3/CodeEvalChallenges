"use strict";

var fs  = require("fs");

var Chall = {};

Chall.main = function(inputFileName) {

	fs.readFileSync(inputFileName).toString().split("\n").forEach(function(line) {

		if(line) {

      var values = line.split(" ");
      var stack = new Stack();

      for(var i = 0; i < values.length; i++) {

        stack.push(values[i]);
      }

      var odd = false;
      process.stdout.write("" + stack.pop());

      while(!stack.isEmpty()) {

        var value = stack.pop();

        if(odd) {

          process.stdout.write(" " + value);
        }

        odd = !odd;
      }
      process.stdout.write("\n");
    }
  });
};

function Stack() {

  this._internal = [];
}

Stack.prototype.push = function(value) {

  this._internal.push(parseInt(value));
};

Stack.prototype.pop = function() {

  return this._internal.pop();
};

Stack.prototype.isEmpty = function() {

  return this._internal.length === 0;
};

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */
