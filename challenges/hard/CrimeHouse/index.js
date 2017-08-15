"use strict";

var fs  = require("fs");

var Chall = {};

const INPUT_MAIN_SEP      = "; ",
      INPUT_EVENTS_SEP    = "|",
      INPUT_EVENT_SEP     = " ",
      INPUT_EVENT_ENTERED = "E",
      INPUT_EVENT_LEFT    = "L",
      OUTPUT_IMPOSSIBLE   = "CRIME TIME";

Chall.main = function(inputFileName) {

	fs.readFileSync(inputFileName).toString().split("\n").forEach(function(line) {

    if(line) {

      try {

        var controller = new Controller();

        // Read input from file
        var tempLine = line.split(INPUT_MAIN_SEP);
        var tempEvents = tempLine[1].split(INPUT_EVENTS_SEP);
        for(var tempEvent of tempEvents) {

          var temp = tempEvent.split(INPUT_EVENT_SEP);
          var eventType = temp[0];
          var personId = parseInt(temp[1]);

          if(personId === 0) {

            if(eventType === INPUT_EVENT_ENTERED) {

              controller.maskedPersonEntered();
            }
            else if(eventType === INPUT_EVENT_LEFT) {

              controller.maskedPersonLeft();
            }
          }
          else {

            if(eventType === INPUT_EVENT_ENTERED) {
              
              controller.personEntered(personId);
            }
            else if(eventType === INPUT_EVENT_LEFT) {

              controller.personLeft(personId);
            }
          }
        }

        // Output the result, if CSP can be solved
        console.log(controller.getMinPeopleInside());
      }
      catch(err) {

        // If an error is thrown, CSP is not feasible: there must be another way in/out
        console.log(OUTPUT_IMPOSSIBLE);
      }
    }
  });
};


/********************************************************************************************************************************/
/********************************************************************************************************************************/
/********************************************************************************************************************************/


/**
 * Main controller for the problem
 */
function Controller() {

  this.timeInstant = -1;
  this.maskedLeftInstants = [];
  this.maskedEnteredInstants = [];
  this.peopleMap = new Map();
  this.csp = new CSP();
}

Controller.TYPE_ENTERED = "E";
Controller.TYPE_LEFT    = "L";

/**
 * Event: masked person left Crime House
 */
Controller.prototype.maskedPersonLeft = function() {

  this._maskedPersonEvent(this.maskedLeftInstants);
};

/**
 * Event: masked person entered Crime House
 */
Controller.prototype.maskedPersonEntered = function() {
  
  this._maskedPersonEvent(this.maskedEnteredInstants);
};

/**
 * Event: known person left Crime House
 */
Controller.prototype.personLeft = function(personId) {

  this._personEvent(personId, Controller.TYPE_LEFT);
};

/**
 * Event: known person entered Crime House
 */
Controller.prototype.personEntered = function(personId) {
  
  this._personEvent(personId, Controller.TYPE_ENTERED);
};

/**
 * Helper for masked people events
 */
Controller.prototype._maskedPersonEvent = function(instantsArray) {
  
  this.timeInstant++;
  
  instantsArray[this.timeInstant] = true;
};

/**
 * Helper for known people events
 */
Controller.prototype._personEvent = function(personId, type) {
  
  this.timeInstant++;

  // Initialize map entry if it's the first event
  if(!this.peopleMap.has(personId)) {

    this.peopleMap.set(personId, {
      firstEvent: null,
      lastEvent: null
    });
  }
  var person = this.peopleMap.get(personId);

  // If we have the same event in a row, we may have a problem: add it to the CSP for later
  if(person.lastEvent && person.lastEvent.type === type) {

    var maskedEventsArray = (type === Controller.TYPE_ENTERED ? this.maskedLeftInstants : this.maskedEnteredInstants);
    var possibleValues = this.getMaskedEventInstantsBetween(maskedEventsArray, person.lastEvent.instant, this.timeInstant);
    this.csp.addVariable(personId + "-" + this.timeInstant, possibleValues);
  }

  // Set new event
  var newEvent = {
    type: type,
    instant: this.timeInstant
  };
  if(!person.firstEvent) {

    person.firstEvent = newEvent;
  }
  person.lastEvent = newEvent;
};

/**
 * Solves the challenge problem
 */
Controller.prototype.getMinPeopleInside = function() {

  // See if CSP is feasible (i.e. people with same event twice in a row could have left/entered masked in between)
  var assignments = this.csp.solve();

  // We get here only if CSP is feasible: remove masked events "used" by the CSP to solve the problems
  for(var assignment of assignments) {

    this.maskedEnteredInstants[assignment.value] = false;
    this.maskedLeftInstants[assignment.value] = false;
  }

  // Build an array containing all remaining masked events
  var eventsForCount = [];
  for(var i = 0; i < this.maskedEnteredInstants.length; i++) {

    if(this.maskedEnteredInstants[i]) {

      eventsForCount[i] = {
        type: Controller.TYPE_ENTERED,
        isMasked: true
      };
    }
  }
  for(i = 0; i < this.maskedLeftInstants.length; i++) {
    
    if(this.maskedLeftInstants[i]) {

      eventsForCount[i] = {
        type: Controller.TYPE_LEFT,
        isMasked: true
      };
    }
  }

  // Add first (if left) and last (if entered) events of each person to this array
  for(var person of this.peopleMap.values()) {

    if(person.firstEvent.type === Controller.TYPE_LEFT) {

      eventsForCount[person.firstEvent.instant] = {
        type: Controller.TYPE_LEFT,
        isMasked: false
      };
    }

    if(person.lastEvent.type === Controller.TYPE_ENTERED) {
      
      eventsForCount[person.lastEvent.instant] = {
        type: Controller.TYPE_ENTERED,
        isMasked: false
      };
    }
  }

  // To get the MIN number of people inside, I need to maximize the E-L pairs
  var maskedEnteredCount = 0;
  var knownEnteredCount = 0;
  var minPeopleInside = 0;
  for(i = 0; i < eventsForCount.length; i++) {

    if(eventsForCount[i]) {

      // People entering, count as a +1 to the total count
      if(eventsForCount[i].type === Controller.TYPE_ENTERED) {
        
        if(eventsForCount[i].isMasked) {
          
          maskedEnteredCount++;
        }
        else {

          knownEnteredCount++;
        }

        minPeopleInside++;
      }

      // People leaving, count as a -1 to the total count, if possible
      else if(eventsForCount[i].type === Controller.TYPE_LEFT) {

        // A "left" event can cancel out a known "entered" event only if it's masked
        if(eventsForCount[i].isMasked && knownEnteredCount > 0) {
          
          minPeopleInside--;
          knownEnteredCount--;
        }

        // A "left" event (both masked and unknown) can cancel out a masked "entered" event
        else if(maskedEnteredCount > 0) {

          minPeopleInside--;
          maskedEnteredCount--;
        }
      }
    }
  }

  return minPeopleInside;
};

/**
 * Returns the events inside "maskedEventsArray" between "fromInstant" and "toInstant"
 */
Controller.prototype.getMaskedEventInstantsBetween = function(maskedEventsArray, fromInstant, toInstant) {

  var result = [];

  for(var i = fromInstant + 1; i < toInstant; i++) {

    if(maskedEventsArray[i]) {

      result.push(i);
    }
  }

  return result;
};


/********************************************************************************************************************************/
/********************************************************************************************************************************/
/********************************************************************************************************************************/


/**
 * Simple implementation of a Constraint Satisfaction Problem solver
 */
function CSP() {

  this.vars = [];
}

/**
 * Adds a variable with its possible values to the problem. Throws an error if values array is empty
 */
CSP.prototype.addVariable = function(varName, possibleValues) {

  if(possibleValues.length === 0) {

    throw varName + " has no possible value";
  }

  this.vars.push({
    name: varName,
    values: possibleValues,
    currInd: -1
  });
};

/**
 * Returns the solution (array of variable-value pairs) if all variables can be assigned to a unique value, throws an error otherwise
 */
CSP.prototype.solve = function() {

  // Trivial case
  if(this.vars.length === 0) {

    return [];
  }

  // Order variables by number of values ASC (simple MRV heuristic)
  this.vars.sort(function(a, b) {

    if(a.values.length < b.values.length) {

      return -1;
    }

    if(a.values.length > b.values.length) {

      return 1;
    }

    return 0;
  });

  // Try all possible combinations of variable-value till we find a valid one
  var varIndex = 0;
  var chosenValues = new Map();
  while(true) {

    // Increase value index
    var values = this.vars[varIndex].values;
    var prevIndex = this.vars[varIndex].currInd;
    var newIndex = prevIndex + 1;
    while(newIndex < values.length && chosenValues.get(values[newIndex])) {

      newIndex++;
    }

    // If no valid index was found
    if(newIndex >= values.length) {

      // If we are looking at the first variable, we are done
      if(varIndex === 0) {

        throw "No possible assignment of values";
      }
      else {

        // Otherwise, backtrack
        this.vars[varIndex].currInd = -1;
        varIndex--;
      }
    }
    else {

      // Valid index found, go to next variable
      this.vars[varIndex].currInd = newIndex;
      chosenValues.set(values[newIndex], true);
      varIndex++;
    }

    // Fix chosen values, if necessary
    if(prevIndex >= 0) {
      
      chosenValues.set(values[prevIndex], false);
    }

    // If this is true, a valid assignment for all variables has been found
    if(varIndex >= this.vars.length) {

      var result = [];

      for(var variable of this.vars) {

        result.push({
          variable: variable.name,
          value: variable.values[variable.currInd]
        });
      }

      return result;
    }
  }
};


/********************************************************************************************************************************/
/********************************************************************************************************************************/
/********************************************************************************************************************************/


// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */