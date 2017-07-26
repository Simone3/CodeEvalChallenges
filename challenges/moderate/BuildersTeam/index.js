"use strict";

var fs  = require("fs");

var Chall = {};

const END    = 25,
      SQRT   = Math.sqrt(END),
      LENGTH = SQRT + 1;

// TODO this works, but there has to be a better solution...!

Chall.main = function(inputFileName) {

	fs.readFileSync(inputFileName).toString().split("\n").forEach(function(line) {

    if(line) {

      var squaresCount = 0;

      // Build graph from input
      var graph = new Graph();
      var edgesTemp = line.split(" | ");
      for(var e = 0; e < edgesTemp.length; e++) {

        var temp = edgesTemp[e].split(" ");
        graph.addEdge(parseInt(temp[0]), parseInt(temp[1]));
      }

      // Loop all nodes
      var iter = graph.iterator();
      for(var i = iter.next(); i !== null; i = iter.next()) {
        
        // For each node, get all the opposite diagonals (bottom-right)
        squaresLoop:
        for(var k = i + LENGTH, r = getRow(i) + 1, j = 1;
            k <= END && getRow(k) === r;
            r++, k += LENGTH, j++) {

          // Check if we have all edges in the square with diagonal i-k
          for(var s = 0; s < j; s++) {

            if(!graph.hasEdge(i + s, i + s + 1) || 
               !graph.hasEdge(k - s, k - s - 1) ||
               !graph.hasEdge(i + SQRT * s, i + SQRT * (s + 1)) ||
               !graph.hasEdge(k - SQRT * s, k - SQRT * (s + 1))) {

                continue squaresLoop;
            }
          }

          // If we have all edges, it's a full square
          squaresCount++;
        }
      }

      console.log(squaresCount);
    }
  });
};

function getRow(i) {

  return Math.ceil(i / SQRT) - 1;
}


/****** Matrix "class" ******/

function Matrix() {
	
  this._internal = [];
  this._width = 0;
  this._height = 0;
}

Matrix.prototype.set = function(row, col, val) {
	
	if(!this._internal[row]) {
		
    this._internal[row] = [];

    if(row + 1 > this._height) {

      this._height = row + 1;
    }
	}
	
  this._internal[row][col] = val;
  
  if(col + 1 > this._width) {

    this._width = col + 1;
  }
};

Matrix.prototype.get = function(row, col) {
	
	if(this._internal[row]) {
		
		return this._internal[row][col];
	}
	
	return null;
};

Matrix.prototype.height = function() {

  return this._height;
};

Matrix.prototype.width = function() {

  return this._width;
};


/****** Graph "class" ******/

function Graph() {
	
	this.adjacencyMatrix = new Matrix();
}

Graph.prototype.addEdge = function(n1, n2) {

	this.adjacencyMatrix.set(n1, n2, 1);
	this.adjacencyMatrix.set(n2, n1, 1);
};

Graph.prototype.hasEdge = function(n1, n2) {
	
	return this.adjacencyMatrix.get(n1, n2) ? true : false;
};

Graph.prototype.iterator = function() {

  var row = 0;
  var that = this;

  return {

    next: function() {

      if(row >= that.adjacencyMatrix.height()) {

        return null;
      }

      var hasEdges = false;
      for(var col = 0; col < that.adjacencyMatrix.width(); col++) {

        if(that.adjacencyMatrix.get(row, col)) {

          hasEdges = true;
          break;
        }
      }

      row++;

      if(hasEdges) {

        return (row - 1);
      }
      else {

        return this.next();
      }
    }
  };
};

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */