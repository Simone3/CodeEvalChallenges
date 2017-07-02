"use strict";

var fs  = require("fs");


/*********************************************************************
 * "Abstract" "class" that handles a generic move (i.e. player action)
 *********************************************************************/

function Move(grid, size) {

	this.grid = grid;
	this.size = size;
	this.obstacleAlreadyMerged = false;
}

/**
 * Perform the move
 */
Move.prototype.execute = function() {

	// Loop all elements of the grid, in the order defined by the "subclasses"
	while(this.nextElement()) {

		// Skip if it's 0
		if(this.getCurrentElement()!==0) {

			// If we have a valid obstacle (i.e. the element closest to the current element in the direction of the move) and the values are the same...
			if(this.isLastObstacleValid() && !this.isLastObstacleAlreadyMerged() && this.getLastObstacleElement()===this.getCurrentElement()) {

				// Merge
				this.updateLastObstacleElement(2*this.getLastObstacleElement());
				this.updateCurrentElement(0);
				this.setLastObstacleAlreadyMerged(true);
			}
			else {

				// Move last obstacle of one position (in any case the current element takes that place)
				this.nextLastObstacleElement();

				// If we can move (i.e. there are empty elements between current element and last obstacle)...
				if(!this.isLastObstacleSameAsCurrent())
				{
					// Move
					this.updateLastObstacleElement(this.getCurrentElement());
					this.updateCurrentElement(0);
				}

				this.setLastObstacleAlreadyMerged(false);
			}
		}
	}
};

/**
 * Current element in the loop
 */
Move.prototype.getCurrentElement = function() {

	return this.grid[this.currentElementRow][this.currentElementColumn];
};

/**
 * Set current element value
 */
Move.prototype.updateCurrentElement = function(value) {

	this.grid[this.currentElementRow][this.currentElementColumn] = value;
};

/**
 * Last obstacle ()
 */
Move.prototype.getLastObstacleElement = function() {

	return this.grid[this.lastObstacleRow][this.lastObstacleColumn];
};

/**
 * Set last obstacle value
 */
Move.prototype.updateLastObstacleElement = function(value) {

	this.grid[this.lastObstacleRow][this.lastObstacleColumn] = value;
};

/**
 * Boolean flag to avoid merging a value more than once per move
 */
Move.prototype.isLastObstacleAlreadyMerged = function() {

	return this.lastObstacleAlreadyMerged;
};

/**
 * Set boolean flag to avoid merging a value more than once per move
 */
Move.prototype.setLastObstacleAlreadyMerged = function(set) {

	this.lastObstacleAlreadyMerged = set;
};

/**
 * Returns true if current and obstacle pointers are the same
 */
Move.prototype.isLastObstacleSameAsCurrent = function() {

	return this.lastObstacleRow === this.currentElementRow && this.lastObstacleColumn === this.currentElementColumn;
};


/*********************************************************************
 * "Subclass" of Move that implements the Down move
 *********************************************************************/

function Down(grid, size) {

    Move.call(this, grid, size);

	this.currentElementRow = this.size-1;
	this.currentElementColumn = 0;

	this.lastObstacleRow = (this.grid[this.size-1][0]===0 ? this.size : this.size-1);
	this.lastObstacleColumn = 0;
}

Down.prototype = Object.create(Move.prototype);

Down.prototype.nextElement = function() {

	if(this.currentElementRow>0) {

		this.currentElementRow--;
		return true;
	}
	else {

		this.currentElementRow = this.size-2;
		this.currentElementColumn++;

		this.lastObstacleAlreadyMerged = false;

		if(this.currentElementColumn<this.size) {

			this.lastObstacleRow = (this.grid[this.size-1][this.currentElementColumn]===0 ? this.size : this.size-1);
			this.lastObstacleColumn = this.currentElementColumn;
			return true;
		}

		return false;
	}
};

Down.prototype.nextLastObstacleElement = function() {

	this.lastObstacleRow--;
};

Down.prototype.isLastObstacleValid = function() {

	return this.lastObstacleRow < this.size;
};


/*********************************************************************
 * "Subclass" of Move that implements the Up move
 *********************************************************************/

function Up(grid, size) {

    Move.call(this, grid, size);

	this.currentElementRow = 0;
	this.currentElementColumn = 0;

	this.lastObstacleRow = (this.grid[0][0]===0 ? -1 : 0);
	this.lastObstacleColumn = 0;
}
Up.prototype = Object.create(Move.prototype);

Up.prototype.nextElement = function() {

	if(this.currentElementRow<this.size-1) {

		this.currentElementRow++;
		return true;
	}
	else {

		this.currentElementRow = 1;
		this.currentElementColumn++;

		this.lastObstacleAlreadyMerged = false;

		if(this.currentElementColumn<this.size) {

			this.lastObstacleRow = (this.grid[0][this.currentElementColumn]===0 ? -1 : 0);
			this.lastObstacleColumn = this.currentElementColumn;
			return true;
		}

		return false;
	}
};

Up.prototype.nextLastObstacleElement = function() {

	this.lastObstacleRow++;
};

Up.prototype.isLastObstacleValid = function() {

	return this.lastObstacleRow >= 0;
};


/*********************************************************************
 * "Subclass" of Move that implements the Left move
 *********************************************************************/

function Left(grid, size) {

    Move.call(this, grid, size);

	this.currentElementRow = 0;
	this.currentElementColumn = 0;

	this.lastObstacleRow = 0;
	this.lastObstacleColumn = (this.grid[0][0]===0 ? -1 : 0);
}
Left.prototype = Object.create(Move.prototype);

Left.prototype.nextElement = function() {

	if(this.currentElementColumn<this.size-1) {

		this.currentElementColumn++;
		return true;
	}
	else {

		this.currentElementRow++;
		this.currentElementColumn = 1;

		this.lastObstacleAlreadyMerged = false;

		if(this.currentElementRow<this.size) {

			this.lastObstacleRow = this.currentElementRow;
			this.lastObstacleColumn = (this.grid[this.currentElementRow][0]===0 ? -1 : 0);
			return true;
		}

		return false;
	}
};

Left.prototype.nextLastObstacleElement = function() {

	this.lastObstacleColumn++;
};

Left.prototype.isLastObstacleValid = function() {

	return this.lastObstacleColumn >= 0;
};


/*********************************************************************
 * "Subclass" of Move that implements the Right move
 *********************************************************************/

function Right(grid, size) {

    Move.call(this, grid, size);

	this.currentElementRow = 0;
	this.currentElementColumn = this.size-1;

	this.lastObstacleRow = 0;
	this.lastObstacleColumn = (this.grid[0][this.size-1]===0 ? this.size : this.size-1);
}
Right.prototype = Object.create(Move.prototype);

Right.prototype.nextElement = function() {

	if(this.currentElementColumn>0) {

		this.currentElementColumn--;
		return true;
	}
	else {

		this.currentElementRow++;
		this.currentElementColumn = this.size-2;

		this.lastObstacleAlreadyMerged = false;

		if(this.currentElementRow<this.size) {

			this.lastObstacleRow = this.currentElementRow;
			this.lastObstacleColumn = (this.grid[this.currentElementRow][this.size-1]===0 ? this.size : this.size-1);
			return true;
		}

		return false;
	}
};

Right.prototype.nextLastObstacleElement = function() {

	this.lastObstacleColumn--;
};

Right.prototype.isLastObstacleValid = function() {

	return this.lastObstacleColumn < this.size;
};


/*********************************************************************
 * Main code
 *********************************************************************/

var Chall = {};

Chall.main = function(inputFileName) {

	fs.readFileSync(inputFileName).toString().split("\n").forEach(function(line) {

		if(line) {

			var input = line.split("; ");
			var direction = input[0];
			var size = input[1];
			var grid = stringToGrid(input[2], size);

			// Get correct "class"
			var move;
			switch(direction) {
			
				case "DOWN":
					move = new Down(grid, size);
					break;

				case "UP":
					move = new Up(grid, size);
					break;

				case "LEFT":
					move = new Left(grid, size);
					break;

				case "RIGHT":
					move = new Right(grid, size);
					break;
			}

			// Apply move
			move.execute();

			console.log(gridToString(grid, size));
		}
	});
};

function gridToString(grid, size)
{
	var result = "";
	for(var r=0; r<size; r++) {

		if(r!==0) {
			result += "|";
		}

		for(var c=0; c<size; c++) {

			result += (c===0 ? "" : " ")+grid[r][c];
		}
	}
	return result;
}

function stringToGrid(string, size) {

	var result = string.split("|");
	for(var i=0; i<size; i++) {

		result[i] = result[i].split(" ");
		for(var j=0; j<size; j++) {

			result[i][j] = parseInt(result[i][j]);
		}
	}
	return result;
}

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */