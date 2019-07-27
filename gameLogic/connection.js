var socket = io.connect('http://localhost:8080');  // TODO: server


function getColor() {
    // TODO сделать получение от сервера

    return Math.random()>0.5?"white":"black";
}

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