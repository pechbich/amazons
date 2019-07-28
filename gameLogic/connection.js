/* global io */

var socket = io.connect('/') // TODO: server

// eslint-disable-next-line no-unused-vars
function initSocket (map) {
  socket.on('selectTile', function (event) {
    console.log(event)
    map.changeSelection(event)
  })

  return {
    selectTile: function (pos) {
      socket.emit('selectTile', pos)
    }
  }
}
