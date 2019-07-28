var socket = io.connect("/");  // TODO: server

function initSocket(map) {
    socket.on('selectTile', function(event){
        console.log(event);
        map.changeSelection(event);
    });

    return {
        selectTile: function(pos) {
            socket.emit('selectTile', pos);
        }
    };
}