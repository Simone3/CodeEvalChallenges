"use strict";

var fs  = require("fs");

var Chall = {};

Chall.main = function(inputFileName) {

  fs.readFileSync(inputFileName).toString().split("\n").forEach(function(line) {

    if(line) {

      var input = new ProblemInput(line);

      var bricksThatCanPass = [];

      for(var i = 0; i < input.bricksLength; i++) {

        var hole = input.getHoleInfos();
        var brick = input.getBrickInfos(i);

        // Sort ASC the brick dimensions
        brick.sizes.sort(sortNumbers);

        // If the two smallest brick sizes (0 and 1) fit in the hole (in any of the two orientations), the brick can pass
        if( (brick.sizes[0] <= hole.width && brick.sizes[1] <= hole.height) || (brick.sizes[0] <= hole.height && brick.sizes[1] <= hole.width) ) {

          bricksThatCanPass.push(parseInt(brick.id));
        }
      }

      if(bricksThatCanPass.length === 0) {

        console.log("-");
      }
      else {

        console.log(bricksThatCanPass.sort(sortNumbers).join(","));
      }
    }
  });
};

/**
 * Wrapper to decode the input string
 */
function ProblemInput(string) {

  /**
   * Private helper to decode the input coordinates
   */
  var decodeCoordinates = function(string) {

    var coordinates = string.substr(1, string.length-2).split(",");

    for(var i = 0; i < coordinates.length; i++) {

      coordinates[i] = parseInt(coordinates[i]);
    }

    return coordinates;
  };

  // Get hole info from input string
  var temp = string.split("|");
  var tempHole = temp[0].split(" ");
  var holeVertex1 = decodeCoordinates(tempHole[0]);
  var holeVertex2 = decodeCoordinates(tempHole[1]);
  var holeW = Math.abs(holeVertex1[0] - holeVertex2[0]);
  var holeH = Math.abs(holeVertex1[1] - holeVertex2[1]);

  // Get list of bricks from input string
  var bricks = temp[1].substr(1, temp[1].length-2).split(");(");

  /**
   * Getter for hole dimensions
   */
  this.getHoleInfos = function() {

    var infos = {};
    infos.width = holeW;
    infos.height = holeH;
    return infos;
  };

  /**
   * Getter for how many bricks we have
   */
  this.bricksLength = bricks.length;

  /**
   * Getter for i-th brick id and dimensions
   */
  this.getBrickInfos = function(i) {

    var infos = {};

    var brick = bricks[i].split(" ");

    infos.id = brick[0];

    var brickVertex1 = decodeCoordinates(brick[1]);
    var brickVertex2 = decodeCoordinates(brick[2]);

    infos.sizes = [];
    infos.sizes.push(Math.abs(brickVertex1[0] - brickVertex2[0]));
    infos.sizes.push(Math.abs(brickVertex1[1] - brickVertex2[1]));
    infos.sizes.push(Math.abs(brickVertex1[2] - brickVertex2[2]));

    return infos;
  };
}

function sortNumbers(a, b) {

  return a - b;
}

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */