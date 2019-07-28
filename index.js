var restify = require('restify')
var fs = require('fs')
var socketio = require('socket.io')
var tools = require('./gameLogic/tools')
var path = require('path')

var server = restify.createServer()
server.name = 'Amazons v0.3'

var io = socketio.listen(server.server) // Ну тут так надо

/*
  Настройка http
*/

server.get('/', function getHTML (req, res, next) {
  fs.readFile(path.join(__dirname, 'index.html'), function (error, data) {
    if (error) {
      next(error)
      return
    }
    res.setHeader('Content-Type', 'text/html')
    res.writeHead(200)
    res.end(data)
    next()
  })
})

server.get('/main', function getJS (req, res, next) {
  fs.readFile(path.join(__dirname, 'main.js'), function (error, data) {
    if (error) {
      next(error)
      return
    }
    res.setHeader('Content-Type', 'text/javascript')
    res.writeHead(200)
    res.end(data)
    next()
  })
})

server.get('/images/:suffix/:name', function getWhiteFigure (req, res, next) {
  fs.readFile(path.join(__dirname, 'src', req.params.name + '.' + req.params.suffix), function (error, data) {
    if (error) {
      next(error)
      return
    }
    res.setHeader('Content-Type', 'image/png')
    res.writeHead(200)
    res.end(data)
    next()
  })
})

server.get('/gameLogic/:name', function (req, res, next) {
  fs.readFile(path.join(__dirname, 'gameLogic', req.params.name), function (error, data) {
    if (error) {
      next(error)
      return
    }
    res.setHeader('Content-Type', 'text/javascript')
    res.writeHead(200)
    res.end(data)
    next()
  })
})

/*
  Настройка socket
*/

var connectedUsers = new Set()

var games = []

io.sockets.on('connection', client => {
  // обработчик когда кто-то начианет искать игру
  client.on('lookForGame', () => {
    console.log('looking for a game' + client.name)
    if (connectedUsers.size === 0) {
      connectedUsers.add(client)
      return
    }

    var lastConnectedUser = tools.popRandomFromSet(connectedUsers)

    games.push({
      white: client,
      black: lastConnectedUser
    })

    var playerPositions = tools.getPositions(8, 2) // TODO передавать размер

    client.emit('gameFound', {
      playerPositions: playerPositions,
      color: 'white'
    })

    lastConnectedUser.emit('gameFound', {
      playerPositions: playerPositions,
      color: 'black'
    })
  })

  console.log('hello blyat')
  client.on('disconnect', () => {

  })

  client.on('selectTile', (data) => {
    var oppenent = tools.findOppenent(games, client)
    oppenent.emit('selectTile', data)
  })
})

/*
  Запуск сервера
*/

server.listen(process.env.PORT || 8080, function () {
  console.log('%s listening at %s', server.name, server.url)
})
