"use strict";

var Lang = {};

Lang.LIST_EXPLANATION = "Simple runner for the CodeEval challenges. Provide argument to run modules: e.g. \"node index.js easy/FizzBuzz\" runs the FizzBuzz challenge, \"node index.js easy/*\" runs all easy challenges";
Lang.LIST_HEADER = "\nThese are the available challenges:\n";
Lang.LIST_DIFFICULTY_PREFIX = "------- ";
Lang.LIST_CHALLENGE_PREFIX = "- ";
Lang.ERR_NO_MODULES = "No modules were found";
Lang.RUN_CHALLENGE_HEADER = function(challName) {return "\n********\n******** CHALLENGE - START: "+challName+"\n********\n";}
Lang.RUN_CHALLENGE_FOOTER = function(challName) {return "********\n******** CHALLENGE - END: "+challName+"\n********\n";}
Lang.RUN_TEST_HEADER = function(testName) {return "---\n--- TEST - START: "+testName+"\n---\n";}
Lang.RUN_TEST_FOOTER = function(testName, timeSec) {return "\n---\n--- TEST - END: "+testName+", PERF: "+timeSec+" seconds\n---\n";}
Lang.RUN_TEST_NONE = "/";


module.exports = Lang;