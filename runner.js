"use strict";

const path   = require('path'),
      fs     = require("fs"),
      cnst   = require("./constants.js"),
      lang   = require("./lang.js");

var Runner = {};

/**
 * Main method, runs the given challenge
 */
Runner.run = function(module) {

    var moduleIndex = path.join(module, cnst.CHALL_MAIN_FILE);
    var moduleInputDir = path.join(module, cnst.CHALL_INPUT_DATA_FOLDER);
    var moduleMain = require("./" + moduleIndex);

    console.log(lang.RUN_CHALLENGE_HEADER(module));

    // Try to find the input files, if any
    var testFiles;
    try {

        testFiles = fs.readdirSync(moduleInputDir);
    }
    catch(err) {

        testFiles = null;
    }

    // If we have input files, run challenge for each of them
    if(testFiles && testFiles.length > 0) {

        testFiles.forEach(function(file) {

            runTest(file, moduleMain, path.join(moduleInputDir, file));
        });
    }

    // Otherwise run without parameters (= challenge is "static")
    else {

        runTest(lang.RUN_TEST_NONE, moduleMain);
    }

    console.log(lang.RUN_CHALLENGE_FOOTER(module));
}

/**
 * Helper to run a test
 */
function runTest(label, main, param) {

    console.log(lang.RUN_TEST_HEADER(label));

    var start = new Date();

    if(param) {

        main(param);
    }
    else {

        main();
    }

    var end = new Date();

    var timeSec = (end.getTime() - start.getTime()) / 1000;

    console.log(lang.RUN_TEST_FOOTER(label, timeSec));
}

module.exports = Runner;