"use strict";

var fs  = require("fs");

var Chall = {};

Chall.main = function(inputFileName) {

	var lines = fs.readFileSync(inputFileName).toString().split("\n");

    Lines:
    for(var l = 0; l < lines.length; l++) {

        var values = lines[l].trim().split(" ");

        /*
        * Build a (partial) matrix containing an "hash" of all interesting sub-arrays
        * - First row contains the hashes of all elements, i.e. hashes[0][i] = h(values[i])
        * - Second row the hashes of all pairs, i.e. hashes[1][i] = h(values[i], values[i+1])
        * - Third row the hashes of all 3-element sub-arrays, i.e. hashes[2][i] = h(values[i], values[i+1], values[i+2])
        * - etc.
        *
        * Note:
        * - Number of rows is floor(values.length/2) because no point in comparing sub-arrays bigger than half our array
        * - Size of columns is values.length but values actually used depend on row (e.g. last column of second row is not
        *   filled since there's no pair)
        */
        var hashes = [];
        var hashesLength = Math.floor(values.length / 2);
        for(var i = 0; i < values.length; i++) {

            for(var j = 0; j < hashesLength; j++) {

                if(!hashes[j]) {

                    hashes[j] = [];
                }

                for(var k = (i >= values.length - j ? values.length - j - 1 : i); k >= 0 && k >= i - j; k--) {

                    if(!hashes[j][k]) {

                        hashes[j][k] = 0;
                    }

                    // Just use the sum as the array hash, probably it can be improved to reduce collisions
                    hashes[j][k] += parseInt(values[i]);
                }
            }
        }
        if(!hashes[0]) {

            hashes[0] = [];
        }

        /*
        * Use the matrix to find cycles: loop all columns (request is to find FIRST cycle) and then all rows.
        * If the hash of the current element is equal to the hash of a possible repetition (e.g. if we are in row 1,
        * i.e. hashes of pairs, check hashes[1][c]==hashes[1][c+2]; if we are in row 2, i.e. hashes of 3-element
        * sub-arrays, check hashes[2][c]==hashes[2][c+3]), we actually loop the original array to see if it's a true
        * repetition (even if hash is equal they may be different, i.e. hash collision).
        */
        for(var c = 0; c < hashes[0].length; c++) {

            Rows:
            for(var r = 0; r < hashes.length; r++)  {

                if(c + r + 1 >= hashes[0].length) {
                    
                    break;
                }

                if(hashes[r][c] === hashes[r][c+r+1]) {

                    var p = 0;
                    while(p < r + 1) {

                        if(values[c + p] !== values[c + r + 1 + p]) {

                            continue Rows;
                        }
                        p++;
                    }

                    var result = "";
                    for(var x = c; x <= c + r; x++) {

                        result += " " + values[x];
                    }
                    console.log(result.trim());

                    continue Lines;
                }
            }
        }
    }
};

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */