"use strict";

var fs  = require("fs");

var Chall = {};

Chall.main = function(inputFileName) {

	fs.readFileSync(inputFileName).toString().split("\n").forEach(function(line) {

		if(line) {

			var values = line.replace("\r", "").split(" | ");
            
            // Build and then print a hierarchy with the given data
            var hierarchy = new Hierarchy();
            values.forEach(function(value) {
                
                hierarchy.add(value[0], value[1]);
            });
            
            console.log(hierarchy.toString());
        }
    });
};

/**
 * Abstraction for the hierarchy concept
 */
function Hierarchy() {

    this.childrenHashMap = {};
    this.isAlsoChildHashMap = {};
}

/**
 * Adds a parent->child pair to the hierarchy
 */
Hierarchy.prototype.add = function(parent, child) {

    this.isAlsoChildHashMap[child] = true;

    if(this.childrenHashMap[parent]) {

        this.childrenHashMap[parent].push(child);
    }
    else {

        this.childrenHashMap[parent] = [child];
    }
};

/**
 * Retrieves the root element (i.e. no parent)
 */
Hierarchy.prototype.getHead = function() {

    var head;

    var parents = Object.keys(this.childrenHashMap);

    for(var i = 0; i < parents.length; i++) {

        if(!this.isAlsoChildHashMap[parents[i]]) {

            head = parents[i];
            break;
        }
    }

    return head;
};

/**
 * Formats the hierarchy in the desired string format
 */
Hierarchy.prototype.toString = function() {

    // Helper to print an element and its children, if any
    var recursiveHelper = function(parent) {

        var children = this.childrenHashMap[parent];

        var result = parent;

        if(children && children.length > 0) {

            children.sort();

            result += " [";
            for(var i = 0; i < children.length; i++) {
                
                result += recursiveHelper.call(this, children[i]) + ", ";
            }
            result = result.slice(0, -2);
            result += "]";
        }

        return result;
    };

    // Start recursion from the root element
    var head = this.getHead();
    return recursiveHelper.call(this, head);
};

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */