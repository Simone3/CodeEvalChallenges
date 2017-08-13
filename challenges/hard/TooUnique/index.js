"use strict";


/**
 * TODO no better solution?
 * maybe break more than one repetition per cycle?
 */



var fs  = require("fs");

const NEW_LINE = 10, // \n
      CARR_RET = 13; // \r

const RESULT_MARKER = "*";

var Chall = {};

Chall.main = function(inputFileName) {

  var buffer = fs.readFileSync(inputFileName);

  var matrix = new Matrix();
  var row = 0;
  var col = 0;

  // Build matrix from input
  for(var i = 0; i < buffer.length; i++) {

    if(buffer[i] === NEW_LINE || buffer[i] === CARR_RET) {

      if(buffer[i] === NEW_LINE) {

        col = 0;
        row++;
      }
    }
    else {

      matrix.set(row, col, String.fromCharCode(buffer[i]));
      col++;
    }
  }

  var queue = new CoordinatesQueue();
  var uniqueMatrixSize;
  var resultSubMatrices = [];
  var wholeMatrix = new SubMatrixCoordinates(0, 0, matrix.height - 1, matrix.width - 1);

  // Start from the whole matrix and break it down if we find repetitions inside
  var coordinates = wholeMatrix;
  while(coordinates) {
    
    // If we found a solution and next sub-matrix is smaller, we are done
    if(uniqueMatrixSize && coordinates.getSize() < uniqueMatrixSize) {

      // Replace target sub-matrices with the required character
      for(var resultSubMatrix of resultSubMatrices) {

        for(var r = resultSubMatrix.rowTop; r <= resultSubMatrix.rowBottom; r++) {
                  
            for(var c = resultSubMatrix.colLeft; c <= resultSubMatrix.colRight; c++) {
        
              matrix.set(r, c, RESULT_MARKER);
            }
          }
      }

      // Print final output and exit
      matrix.print(wholeMatrix);
      return;
    }

    // If we have repetitions inside the current matrix, split it to remove it
    var parts = matrix.splitIfNonUnique(coordinates);

    // If no split, it's one of the solutions!
    if(parts.length === 1) {

      uniqueMatrixSize = parts[0].getSize();
      resultSubMatrices.push(parts[0]);
    }
    else {

      // Otherwise, push the parts in the priority queue
      for(var part of parts) {

        queue.push(part);
      }
    }

    // Get sub-matrix with biggest size from the priority queue and continue
    coordinates = queue.pop();
  }
};


/********************************************************************************************************************************/
/********************************************************************************************************************************/
/********************************************************************************************************************************/

/**
 * Simple matrix implementation
 */
function Matrix() {

  this.internal = [];
  this.repetitionPointers = new Map();

  this.width = 0;
  this.height = 0;
}

/**
 * Sets a value
 */
Matrix.prototype.set = function(row, col, val) {

  // Manage height
  if(!this.internal[row]) {
		
    this.internal[row] = [];

    if(row + 1 > this.height) {

      this.height = row + 1;
    }
  }
  
  // Manage width
  if(col + 1 > this.width) {
    
    this.width = col + 1;
  }

  // Get repetitions for this value
  var repetitions;
  if(this.repetitionPointers.has(val)) {

    repetitions = this.repetitionPointers.get(val);
  }
  else {

    repetitions = [];
    this.repetitionPointers.set(val, repetitions);
  }

  // Push these coordinates as repetition
  repetitions.push([row, col]);
  
  // Set value
  this.internal[row][col] = {
    value: val,
    repetitions: repetitions
  };
};

/**
 * Gets a value
 */
Matrix.prototype.get = function(row, col) {
	
	return this.internal[row][col];
};

/**
 * Checks if the given sub-matrix contains at least a repetition:
 * - if so, splits the matrix in up to 4 parts to remove the repetition and returns the array of the parts
 * - otherwise returns an array containing the sub-matrix itself
 */
Matrix.prototype.splitIfNonUnique = function(coordinates) {

  for(var row = coordinates.rowTop; row <= coordinates.rowBottom; row++) {
    
    for(var col = coordinates.colLeft; col <= coordinates.colRight; col++) {

      // Loop repetitions of this value
      var repetitions = this.get(row, col).repetitions;
      for(var repetition of repetitions) {

        // If the repeated value in actually inside the sub-matrix
        if(coordinates.rowTop  <= repetition[0] && repetition[0] <= coordinates.rowBottom &&
           coordinates.colLeft <= repetition[1] && repetition[1] <= coordinates.colRight) {

          if(repetition[0] !== row || repetition[1] !== col) {

            // Split matrix (horizontally and vertically) and return the parts
            var parts = [];
            var repetitionCoordinates = new SubMatrixCoordinates(row, col, repetition[0], repetition[1]);
            this.splitHelper(repetitionCoordinates, coordinates, parts, "rowTop", "rowBottom");
            this.splitHelper(repetitionCoordinates, coordinates, parts, "colLeft", "colRight");
            return parts;
          }
        }
      }
    }
  }

  // No repetition found
  return [coordinates];
};

/**
 * Internal helper to split the sub-matrix
 */
Matrix.prototype.splitHelper = function(repetition, coordinates, parts, fromAttr, toAttr) {
  
  var pos, firstPart, secondPart;

  // First part (upper or left)
  pos = repetition[toAttr];
  if(pos !== coordinates[fromAttr]) {

    firstPart = coordinates.clone();
    firstPart[toAttr] = pos - 1;
    parts.push(firstPart);
  }

  // Second part (lower or right)
  pos = repetition[fromAttr];
  if(pos !== coordinates[toAttr]) {

    secondPart = coordinates.clone();
    secondPart[fromAttr] = pos + 1;
    parts.push(secondPart);
  }
};

/**
 * Prints the given sub-matrix
 */
Matrix.prototype.print = function(coordinates) {
  
  for(var row = coordinates.rowTop; row <= coordinates.rowBottom; row++) {

    for(var col = coordinates.colLeft; col <= coordinates.colRight; col++) {

      process.stdout.write(this.get(row, col).value);
    }

    process.stdout.write("\n");
  }
};


/********************************************************************************************************************************/
/********************************************************************************************************************************/
/********************************************************************************************************************************/

/**
 * Object that represents a sub-matrix coordinates
 */
function SubMatrixCoordinates(rowTop, colLeft, rowBottom, colRight) {

  this.rowTop    = rowTop;
  this.colLeft   = colLeft;
  this.rowBottom = rowBottom;
  this.colRight  = colRight;
}

/**
 * Creates a copy of the object
 */
SubMatrixCoordinates.prototype.clone = function() {

  return new SubMatrixCoordinates(this.rowTop, this.colLeft, this.rowBottom, this.colRight);
};

/**
 * Returns a string representation of the object
 */
SubMatrixCoordinates.prototype.serialize = function() {

  return this.rowTop + "," + this.colLeft + "," + this.rowBottom + "," + this.colRight;
};

/**
 * Returns the size (i.e. width * height) of the sub-matrix
 */
SubMatrixCoordinates.prototype.getSize = function() {
  
  return (1 + this.rowBottom - this.rowTop) * (1 + this.colRight - this.colLeft);
};

/**
 * Used by the priority queue to order values
 */
SubMatrixCoordinates.prototype.getPriority = function() {
  
  return this.getSize();
};


/********************************************************************************************************************************/
/********************************************************************************************************************************/
/********************************************************************************************************************************/

/**
 * Priority queue implementation that:
 * - stores values in order (greatest first), using the element's "getPriority" method to decide ordering
 * - stores a history of all current and past values to avoid pushing a value twice
 */
function CoordinatesQueue() {

  this.content = [];
  this.history = new Map();
}

/**
 * Adds an element. The object must implement a "getPriority" method
 */
CoordinatesQueue.prototype.push = function(element) {
  
  // Push only if the value has never been in the queue
  var serialized = element.serialize();
  if(!this.history.has(serialized)) {

    // Refresh internal component to maintain the order
    this.content.push(element);
    this.bubbleUp(this.content.length - 1);

    // Set history
    this.history.set(serialized, true);
  }
};

/**
 * Returns the element with gretest priority
 */
CoordinatesQueue.prototype.pop = function() {

  // Max value if the first of the array
  var result = this.content[0];

  // Refresh internal component to maintain the order
  var end = this.content.pop();
  if(this.content.length > 0) {

    this.content[0] = end;
    this.sinkDown(0);
  }

  return result;
};

/**
 * Helper to fix order after insertion
 */
CoordinatesQueue.prototype.bubbleUp = function(i) {

  // The i-th element needs to be moved
  var element = this.content[i];
  var priority = element.getPriority();

  // If we reach first position, no need to continue
  while(i > 0) {

    // Get current element's parent
    var parentI = Math.floor((i + 1) / 2) - 1;
    var parent = this.content[parentI];

    // Stop if we reached the correct order
    if(priority <= parent.getPriority()) {
      
      break;
    }

    // Swap element and parent
    this.content[parentI] = element;
    this.content[i] = parent;
    i = parentI;
  }
};

/**
 * Helper to fix order after removal
 */
CoordinatesQueue.prototype.sinkDown = function(i) {

  var length = this.content.length;

  // The i-th element needs to be moved
  var element = this.content[i];
  var elemPriority = element.getPriority();

  while(true) {

    var swap = null;
    var firstChildPriority;

    // Get the two children
    var secondChildI = (i + 1) * 2;
    var firstChildI = secondChildI - 1;

    // Check if first child needs to be swapped
    if(firstChildI < length) {

      var firstChild = this.content[firstChildI];
      firstChildPriority = firstChild.getPriority();

      if(firstChildPriority > elemPriority) {

        swap = firstChildI;
      }
    }

    // Check if second child needs to be swapped
    if(secondChildI < length) {

      var secondChild = this.content[secondChildI];
      var secondChildPriority = secondChild.getPriority();

      if(secondChildPriority > (swap === null ? elemPriority : firstChildPriority)) {

        swap = secondChildI;
      }
    }

    // Stop if we reached the correct order
    if(swap === null) {
      
      break;
    }

    // Swap element and child
    this.content[i] = this.content[swap];
    this.content[swap] = element;
    i = swap;
  }
};


/********************************************************************************************************************************/
/********************************************************************************************************************************/
/********************************************************************************************************************************/


// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */