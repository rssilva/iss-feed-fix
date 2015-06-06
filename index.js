'use strict';

const port = 3000;

let http = require('http');
let Router = require('node-simple-router');

let router = new Router();

let Parser = require('./app/Parser')(router);

http.createServer(router).listen(port);

console.log('listening on ', port);

router.get('/', (req, res) => {
  res.write('Hello!')
  res.end();
});
