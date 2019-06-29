const width = 1024;
const height = 1024;

function start(size){
    canvas = document.getElementById("screen");    
    ctx = canvas.getContext("2d");    
    
    ctx.fillStyle = "green";
    var map = new Map(8, 8);

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        map.update();
        map.draw(ctx);
        map.clickHandler(map, canvas);
        setTimeout(gameLoop, 0.03);
    }

    setTimeout(gameLoop, 0.03);
}

function changePosition(object, newPosX, newPosY){
    object.PosX = newPosX;
    object.PosY = newPosY;
    // return object ?
}

function highlightTile(map, x, y){
    var tile = map.tiles[x][y];
    if (!tile.selected){
        for (var i=0; i<map.tiles.length; i++){
            for (var j=0; j<map.tiles[i].length; j++){
                let tile = map.tiles[i][j];
                tile.selected = false;
                tile.bodyColour = tile.defaultBodyColour;
            }
        }
        tile.bodyColour = "#cc0000";
        tile.selected = true;
    } else {
        tile.bodyColour = tile.defaultBodyColour;
        tile.selected = false;
    }
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
                    this.tiles[i].push(new Tile(i, j, "#999966"));                    
                } else {
                    this.tiles[i].push(new Tile(i, j, "#cc9900"));
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
                this.tiles[i][j].draw(canvas, j*width, i*width, width);
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
                            highlightTile(map, j, i); //idk whyy but its backwards
                        }
                }
            }
        }, false);
    }
}


class Tile{
    borderColour = "#101010";

    constructor(posX, posY, bodyColour){
        this.posX = posX;
        this.posY = posY;
        this.bodyColour = bodyColour;
        this.figure = null;
        this.selected = false;
        this.defaultBodyColour = bodyColour;   
    }

    draw(canvas, offsetX, offsetY, size) {
        canvas.fillStyle = this.bodyColour;
        canvas.fillRect(offsetX, offsetY, size, size);
        canvas.fillStyle = this.borderColour;
        canvas.rect(offsetX, offsetY, size, size);
        // draws figures everywhere
        var fig = new Figure("white");
        canvas.drawImage(fig.figureImage, offsetX, offsetY, size, size);
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
        this.figureImage = new Image();
        if (team == 'white'){
            this.figureImage.src = '/images/whtfig';
        } else {
            this.figureImage.src = '/images/blkfig';
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

}