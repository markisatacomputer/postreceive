'use strict';

var express = require('express');
var Q       = require('q');
var exec    = require('exec');

var router = express.Router();

router.post('/', function(req, res) {
  //  Reject if not Xhub
  if(!req.isXHub) { 
    return this.reject('No X-Hub Signature', req, res);
  } else if (!req.isXHubValid()) {
    return this.reject('Invalid X-Hub Request', req, res);
  }

  //  move to repo, pull from origin, 
  runCommands([
    "cd " + process.env.REPO_DIR,
    "git pull origin master",
    "stop " + process.env.PROCESS_NAME,
    "start " + process.env.PROCESS_NAME
  ]).then( function(allRes) {
    res.json(allRes);
  });
});

var runCommands = function(commands) {
  var deferred = Q.defer();
  if (commands.length > 0) {
    var command = commands.shift();
    exec(command, function(error, stdout, stderr) {
      if (error) {
        deferred.reject(error);
      } else {
        if (commands.length > 0) {
          runCommands(commands);
        } else {
          deferred.resolve(stdout);
        }
      }
    });
  }
  
  return deferred.promise;
}

module.exports = router;