const width = 1024;
const height = 1024;
var bodyColor;

function start(size){
    canvas = document.getElementById("screen");    
    ctx = canvas.getContext("2d");
    
    ctx.fillStyle = "green";
    var map = new Map(8, 8, canvas);

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        map.update();
        map.draw(ctx);
<<<<<<< HEAD
        setTimeout(gameLoop, 0.03)
=======
        setTimeout(gameLoop, 0.033);
>>>>>>> e5e255068ad864311c40c5038ca6905fae902989
    }

    setTimeout(gameLoop, 0.033);
}


class GameEvent {
    func = null;
    listeners = null;

    constructor() {
        this.listeners = {};
        this.lastListenerIndex = 0;
    }

    addListener(func) {
        this.listeners[this.lastListenerIndex] = func;
        this.lastListenerIndex+=1;

        // когда добавляешь обработчик хочется иметь возможность его удалить, 
        // а часто передают анонимную функцию в обработчик,
        // поэтому возвращаем некоторую информацию, которая позволит удалить обработчик
        return {
            key:this.lastListenerIndex-1,
            func: func
        };
    }

    removeListener(listener) {
        delete this.listeners[listener.key];
    }

    call(eventInfo) {
        // когда событие происходит - необходимо вызвать этот метод, 
        // который передаст всю информацию о событии во все "привязанные" обработчики
        for (var key in this.listeners) {
            let listener = this.listeners[key];
            listener(eventInfo);
        }
    }
}

class Map{
    gameEvents = {
        log: new GameEvent(),
        selectTile: new GameEvent(),
        unselectTile: new GameEvent(),
        selectFigure: new GameEvent(),
        moveFigure: new GameEvent(),
        shootFire: new GameEvent()
    }; // список игровых событий


    constructor(sizeX, sizeY, canvas) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.tiles = [];

        for (var i=0; i<sizeY; i++) {
            this.tiles.push([]);
            for (var j=0; j<sizeX; j++) {
                let white = (i+j)%2;
                if (white){
                    this.tiles[i].push(new Tile({y:i, x:j}, bodyColor="#A4A4A4"));
                    
                } else {
                    this.tiles[i].push(new Tile({y:i, x:j}, bodyColor="#000000"));
                }
            }
<<<<<<< HEAD
        }        
        this.clickHandler(this, canvas);
=======
        }
        
        var map = this

        var gameEvents = this.gameEvents;
        
        // необходимо перейти от абстракции системных событий (таких как клики), к игровым событиям
        canvas.addEventListener("click", function(event){
            
            var tile = map.getTile(event);
            
            // собираем необходимую информацию о событии
            let eventInfo = {
                tile: tile
            };
            
            // тут срабатывают gameEvents

            gameEvents.log.call(eventInfo);

            if (selectedTile.tile !== null) {
                gameEvents.unselectTile.call(eventInfo);
            }

            gameEvents.selectTile.call(eventInfo);
               
        }, false);

        this.gameEvents.log.addListener(function(e) {
            console.log(e)
        });
        
        var selectedTile = {tile: null}
        this.gameEvents.selectTile.addListener(function(e) {
            var tile = e.tile;
            tile.bodyColor = "#440000";
            selectedTile.tile = tile;
            
            // когда выделяем клетку, то добавляем обработчик события, который отменит выделение клетки
            var b = {} // сюда будет записан созданный "слушатель"
            b.listener = map.gameEvents.unselectTile.addListener(function(e2){
                let white = (tile.position.x+tile.position.y)%2;
                if (white){
                    bodyColor="#A4A4A4";
                    
                } else {
                    bodyColor="#000000";
                }
                tile.bodyColor = bodyColor;

                // удаляем обработчик события, который отменял выделение
                map.gameEvents.unselectTile.removeListener(b.listener);
            })
        });
>>>>>>> e5e255068ad864311c40c5038ca6905fae902989
    }

    update() {
        // тут происходит вся логика игры
    }

    draw(canvas) {
        var width;
        if (this.sizeX > this.sizeY){
            width = 1024/this.sizeX;
        } else {
            width = 1024/this.sizeY;
        }
        for (var i=0; i<this.sizeY; i++) {
            for (var j=0; j<this.sizeX; j++) {
                this.tiles[i][j].draw(canvas, {x:j*width, y:i*width}, width);
            }
        }
    }

<<<<<<< HEAD
    clickHandler(map, canvas){
        //move to constructor        
        canvas.addEventListener("click", function(event){
            var x = event.pageX - canvas.offsetLeft,
                y = event.pageY - canvas.offsetTop;
            for (var i=0; i<map.sizeY; i++){
                for (var j=0; j<map.sizeX; j++){
                    let height = 1024/map.sizeY;
                    let width = 1024/map.sizeX;
                    if (y > j*height && 
                        y < (j+1)*height && 
                        x > i*width &&
                        x < (i+1)*width){
                            console.log(i+" "+j);
                        }
=======
    getTile(event){
        // возвращает Tile, на который нажал event

        var x = event.pageX - canvas.offsetLeft,
            y = event.pageY - canvas.offsetTop;
        for (var i=0; i<this.sizeY; i++){
            for (var j=0; j<this.sizeX; j++){
                let height = 1024/this.sizeY;
                let width = 1024/this.sizeX;
                if (y > j*height && 
                    y < (j+1)*height && 
                    x > i*width &&
                    x < (i+1)*width){
                        var posX = Math.floor(j),
                            posY = Math.floor(i);
                        var selectedTile = this.tiles[posX][posY];
                        return selectedTile;
                    }
>>>>>>> e5e255068ad864311c40c5038ca6905fae902989
                }
            }
        return null
    }

}


class Tile{
    borderColor = "#101010";

    constructor(position, bodyColor){
        this.position = position;
        this.bodyColor = bodyColor;
        this.figure = null;   
    }

    draw(canvas, offset, size) {
        canvas.fillStyle = this.bodyColor;
        canvas.fillRect(offset.x, offset.y, size, size);
        canvas.fillStyle = this.borderColor;
        canvas.rect(offset.x, offset.y, size, size);
        canvas.stroke();
    }

    isEmpty(){
        return this.figure == null;
    }

    takeFigureAway(){
        takenFigure = this.figure;
        this.figure == NaN;
        return takenFigure;
    }

    placeFigureHere(figure){
        this.figure = figure;
    }
}

class Figure {
        
    constructor(team){
        var figureImage = new Image();
        if (team == 'white'){
            figureImage.src = '/images/whtfig';
        } else {
            figureImage.src = '/images/blkfig';
        }
    }
    
    draw(canvas, size) {
       //useless lmao 
    }
}

class Player {

    constructor(team, numOfFigures) {
        this.team = team;
        this.allFigures = [];
        for (i = 0; i<numOfFigures; i++){
            this.allFigures[i].push(new Figure(this.team))
        }
    }

    moveFigure(fromTile, toTile){
        if (toTile.isEmpty()){
            takenFigure = fromTile.takeFigureAway();        
            toTile.placeFigureHere(takenFigure);
        }
    }

    /* getAllFigures() {
        return this.allFigures;
    } */

}