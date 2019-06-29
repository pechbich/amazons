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

server.get('/main', function getJS(req, res, next){
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

server.get('/images/whtfig', function getWhiteFigure(req, res, next){
  fs.readFile(__dirname + '/whtfig.png', function(error, data){
    if (error){
      next(error);
      return;
    }
    res.setHeader('Content-Type', 'image/png');
        res.writeHead(200);
        res.end(data);
        next();
  })
})

server.get('/images/blkfig', function getBlackFigure(req, res, next){
  fs.readFile(__dirname + '/blkfig.png', function(error, data){
    if (error){
      next(error);
      return;
    }
    res.setHeader('Content-Type', 'image/png');
        res.writeHead(200);
        res.end(data);
        next();
  })
})

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});