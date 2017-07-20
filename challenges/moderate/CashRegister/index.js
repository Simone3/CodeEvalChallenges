"use strict";

var fs  = require("fs");

var Chall = {};

const ERROR = "ERROR",
      ZERO  = "ZERO",
      MONEY = [{text: "PENNY",       value: 0.01},
               {text: "NICKEL",      value: 0.05},
               {text: "DIME",        value: 0.10},
               {text: "QUARTER",     value: 0.25},
               {text: "HALF DOLLAR", value: 0.50},
               {text: "ONE",         value: 1.00},
               {text: "TWO",         value: 2.00},
               {text: "FIVE",        value: 5.00},
               {text: "TEN",         value: 10.00},
               {text: "TWENTY",      value: 20.00},
               {text: "FIFTY",       value: 50.00},
               {text: "ONE HUNDRED", value: 100.00}];

Chall.main = function(inputFileName) {

	fs.readFileSync(inputFileName).toString().split("\n").forEach(function(line) {

    if(line) {

      var input = line.split(";");
      var rem = sub(parseFloat(input[1]), parseFloat(input[0]));
      var res;

      if(rem < 0) {

        res = ERROR;
      }
      else if(rem === 0) {

        res = ZERO;
      }
      else {

        res = "";

        var i = MONEY.length - 1;
        while(rem > 0) {
          
          var tmp = sub(rem, MONEY[i].value);
          if(tmp >= 0) {

            rem = tmp;
            res +=  MONEY[i].text + ",";
          }
          else {

              i--;
          }
        }

        res = res.slice(0, -1);
      }

      console.log(res);
    }
  });
};

/**
 * To avoid floating point problems
 */
function sub(f1, f2) {

  return parseFloat((f1 - f2).toFixed(2));
}

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */