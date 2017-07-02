"use strict";

var fs  = require("fs");

const ALIVE             = "*",
      DEAD              = ".",
      ALIVE_THRESHOLD_L = 2,
      ALIVE_THRESHOLD_U = 3,
      DEAD_VALUE        = 3,
      ITERATIONS        = 10;

var configuration = [];

var Chall = {};

Chall.main = function(inputFileName) {

  fs.readFileSync(inputFileName).toString().split("\n").forEach(function(line) {

    if(line) {

      configuration.push(line.trim());
    }
  });

  for(var iterNum = 1; iterNum <= ITERATIONS; iterNum++) {

    configuration = performIteration(configuration);
  }

  printConfiguration(configuration);
};

function isAlive(configuration, row, col) {

  if(row<0 || row>=configuration.length || col<0 || col>=configuration[row].length) {

    return false;
  }
  return configuration[row][col] === ALIVE;
}

function countLiveNeighbors(configuration, row, col) {

  var count = 0;

  for(var rowInc = -1; rowInc <= 1; rowInc++) {

    for(var colInc =- 1; colInc <= 1; colInc++) {

      if(rowInc!==0 || colInc!==0) {

        if(isAlive(configuration, row + rowInc, col + colInc)) {
          
          count++;
        }
      }
    }
  }

  return count;
}

function performIteration(configuration) {

  var newConfiguration = [];

  for(var row=0; row<configuration.length; row++) {

    newConfiguration[row] = [];

    for(var col=0; col<configuration[row].length; col++) {

      var liveNeighbors = countLiveNeighbors(configuration, row, col);
      var alive = isAlive(configuration, row, col);

      if( alive && (liveNeighbors < ALIVE_THRESHOLD_L || liveNeighbors > ALIVE_THRESHOLD_U) ) {

        newConfiguration[row][col] = DEAD;
      }
      else if(!alive && liveNeighbors === DEAD_VALUE) {

        newConfiguration[row][col] = ALIVE;
      }
      else {

        newConfiguration[row][col] = configuration[row][col];
      }
    }
  }

  return newConfiguration;
}

function printConfiguration(configuration) {

  for(var row=0; row<configuration.length; row++) {

    for(var col=0; col<configuration[row].length; col++) {

      process.stdout.write(configuration[row][col]);
    }
    process.stdout.write("\n");
  }
}

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */