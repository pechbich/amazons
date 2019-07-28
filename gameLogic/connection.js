/* global io */

var socket = io.connect('/') // TODO: server

// eslint-disable-next-line no-unused-vars
function initSocket (map) {
  socket.on('selectTile', function (event) {
    console.log(event)
    map.changeSelection(event)
  })

  socket.on('moveEvent', function (event) {
    console.log(event)
    var startTile = map.getTile(event.start.x, event.start.y)
    var endTile = map.getTile(event.end.x, event.end.y)

    var figure = startTile.takeFigure()

    endTile.placeFigure(figure)

    map.draw()
  })

  socket.on('gameOver', function (event) {
    alert(event.message)
  })

  return {
    selectTile: function (pos) {
      socket.emit('selectTile', pos)
    },

    moveEvent: function (data) {
      socket.emit('moveEvent', data)
    }
  }
}
