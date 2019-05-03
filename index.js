/* const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
}); */

var restify = require('restify');
var fs = require('fs');

function respond(req, res, next) {
  res.send();
  next();
}

var server = restify.createServer();

server.get('/', function getHTML(req, res, next) {
    fs.readFile(__dirname + '/index.html', function(error, data){
        if (error) {
            next(error);
            return;
        }
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end(data);
        next();
    })
})

server.get('/main.js', function getJS(req, res, next){
  fs.readFile(__dirname + '/main.js', function(error, data){
    if (error){
      next(error);
      return;
    }
    res.setHeader('Content-Type', 'text/javascript');
        res.writeHead(200);
        res.end(data);
        next();
  })
})

server.get('/index.js', function getIndex(req, res, next){
  fs.readFile(__dirname + '/index.js', function(error, data){
    if (error){
      next(error);
      return;
    }
    res.setHeader('Content-Type', 'text/javascript');
        res.writeHead(200);
        res.end(data);
        next();
  })
})

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});