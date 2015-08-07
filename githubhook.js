'use strict';

var express = require('express');
var Q       = require('q');
var exec = require('child_process').exec,
    child;


var router = express.Router();

router.post('/', function(req, res) {
  //  Reject if not Xhub
  if(!req.isXHub) { 
    return this.reject('No X-Hub Signature', req, res);
  } else if (!req.isXHubValid()) {
    return this.reject('Invalid X-Hub Request', req, res);
  }
      //  restart process 
      runCommands([
        "git pull origin master",
        "stop " + process.env.PROCESS_NAME,
        "start " + process.env.PROCESS_NAME
      ]).then( function(allRes) {
        res.json(allRes);
      }, function(err){
        res.status(500).json(err);
      });
});

var runCommands = function(commands) {
  var deferred = Q.defer();
  if (commands.length > 0) {
    var command = commands.shift();
    console.log('executing: ', command);
    exec(command, {timeout: 15, cwd: process.env.REPO_DIR}, function(error, stdout, stderr) {
      if (error) {
        deferred.reject(error);
      } else {
        console.log('result: ', stdout);
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
