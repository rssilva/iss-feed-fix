'use strict';

let http = require('http');
var port = 3000;

http.createServer(function (req, res) {
  res.write('Hello!');
  res.end();
}).listen(port);

console.log('listening ', port);
