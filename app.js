/**
 * Main application file
 */

'use strict';


var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var xhub = require('express-x-hub');
var config = require('./config');

// Setup server
var app = express();
var server = require('http').createServer(app);
app.use(xhub({ algorithm: 'sha1', secret: prcess.env.GH_SECRET }));
app.use(bodyParser());
app.use(methodOverride());
// Our only route
app.use('/ghup', require('./githubhook'));

// Start server
server.listen(process.env.POSTRECEIVE_PORT, process.env.IP, function () {
  console.log('Express server listening on 80');
});

// Expose app
exports = module.exports = app;