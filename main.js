const width = 1024;
const height = 1024;
var bodyColor;

function start(size){
    canvas = document.getElementById("screen");
    ctx = canvas.getContext("2d");
    
    ctx.fillStyle = "green";
    var map = new Map(8, 8);

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        map.update();
        map.draw(ctx);
        setTimeout(gameLoop, 0.03)
    }

    setTimeout(gameLoop, 1)
}

class Map{
    constructor(sizeX, sizeY) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.tiles = [];

        for (var i=0; i<sizeY; i++) {
            this.tiles.push([]);
            for (var j=0; j<sizeX; j++) {
                let sum = i+j;
                if (sum % 2 == 0){
                    this.tiles[i].push(new Tile({y:i, x:j}, bodyColor="#A4A4A4"));
                    
                } else {
                    this.tiles[i].push(new Tile({y:i, x:j}, bodyColor="#000000"));
                }
            }
        }
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

}


class Tile{
    borderColor = "#101010";

    constructor(position, bodyColor){
        this.position = position;
        this.bodyColor = bodyColor;
        this.figure = figure;
        this.empty = true;     
    }

    draw(canvas, offset, size) {
        canvas.fillStyle = this.bodyColor;
        canvas.fillRect(offset.x, offset.y, size, size);
        canvas.fillStyle = this.borderColor;
        canvas.rect(offset.x, offset.y, size, size);
        canvas.stroke();
    }

    isEmpty(){
        if (this.figure == None){
            this.empty = true;
        } else {
            this.empty = false;
        }
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
        takenFigure = fromTile.takeFigureAway();
        toTile.placeFigureHere(takenFigure);
    }

    /* getAllFigures() {
        return this.allFigures;
    } */

}