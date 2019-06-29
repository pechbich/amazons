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
        map.clickHandler(map, canvas);
        setTimeout(gameLoop, 0.03)
    }

    setTimeout(gameLoop, 1)
}

function changePosition(object, newPosX, newPosY){
    object.PosX = newPosX;
    object.PosY = newPosY;
    // return object ?
}

function highlightTile(tile){
    tile.bodyColor = "#FFFFFF";
    tile.selected = true;
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

    clickHandler(map, canvas){        
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
                            highlightTile(map.tiles[j][i]); //idk whyy but its backwards
                        }
                }
            }
        }, false);


    }

    /* selectTile(posX, posY){
        selectedTile = this.tiles[posX][posY];
        selectedTile.bodyColor = "#f43e16";
        console.log("selected tile");
        //пока что юзлес
    } */

}


class Tile{
    borderColor = "#101010";

    constructor(position, bodyColor){
        this.position = position;
        this.bodyColor = bodyColor;
        this.figure = null;
        this.selected = false;   
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