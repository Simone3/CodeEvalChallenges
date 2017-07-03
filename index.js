"use strict";

const fs     = require("fs"),
      path   = require("path"),
      glob   = require("glob"),
      cnst   = require("./constants.js"),
      lang   = require("./lang.js"),
      runner = require("./runner.js");

var modulesToRun = process.argv[2];

if(!modulesToRun) {

    console.log(lang.LIST_EXPLANATION);
    console.log(lang.LIST_HEADER);

    // Loop all difficulties modes directories
    fs.readdirSync(cnst.CHALLENGES_FOLDER).forEach(function(file) {

        var fullFilePath = path.join(cnst.CHALLENGES_FOLDER, file);
        if(isDirectory(fullFilePath)) {

            console.log(lang.LIST_DIFFICULTY_PREFIX + file);

            // Loop all challenges directories in this directory
            fs.readdirSync(fullFilePath).forEach(function(file) {
                    
                if(isDirectory(path.join(fullFilePath, file))) {

                    console.log(lang.LIST_CHALLENGE_PREFIX + file);
                }
            });
        }
    });
}
else {

    // Get all modules matching the provided wildcard and run them
    glob(path.join(cnst.CHALLENGES_FOLDER, modulesToRun), {}, function(err, files) {
        
        if(err) {

            console.log(err);
        }
        else {

            if(files && files.length > 0) {

                files.forEach(function(file) {

                    if(isDirectory(file)) {

                        runner.run(file);
                    }
                });
            }
            else {

                console.log(lang.ERR_NO_MODULES);
            }
        }
    });
}

function isDirectory(fullFilePath) {

   return fs.lstatSync(fullFilePath).isDirectory();
}