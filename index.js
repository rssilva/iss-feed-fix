'use strict';

var port = process.env.PORT || 3000;

var http = require('http');
var Router = require('node-simple-router');

var router = new Router();

http.createServer(router).listen(port);

console.log('listening on ', port);

router.get('/', function (req, res) {
  res.write('Hello!');
  res.end();
});
