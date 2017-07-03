"use strict";

var fs  = require("fs");

var Chall = {};

Chall.main = function(inputFileName) {

	fs.readFileSync(inputFileName).toString().split("\n").forEach(function(line) {

        if(line) {

            var values = line.split(" | ");

            var size = values[0].split("x");
            var width = parseInt(size[0]);
            var height = parseInt(size[1]);

            var coordinates = values[1].split(" ");
            var endX = parseInt(coordinates[0]);
            var endY = parseInt(coordinates[1]);

            // Get how many FULL circles (well, rectangles) Robo does before reaching Robitta
            var fullCircles = Math.min(Math.min(Math.min(height - endY, endY - 1), width - endX), endX - 1);

            // Add nuts that Robo gets in the full circles
            var nuts = 2 * fullCircles * (width + height - 2 * fullCircles);

            // "Restrict" problem so that we have no full circles
            width -= 2 * fullCircles;
            height -= 2 * fullCircles;
            endX -= fullCircles;
            endY -= fullCircles;

            // Compute how many nuts in the last circle (i.e. the only one not full)
            if(endY === height) { // upper segment
            
                nuts += endX;
            }
            else if(endX === width) { // right segment
            
                nuts += width + (height - endY);
            }
            else if(endY === 1) { // lower segment
            
                nuts += width + (height - 2) + (width - endX + 1);
            }
            else { // left segment
            
                nuts += width + (height - 2) + width + (endY - 1);
            }

            console.log(nuts);
        }
    });
};

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */