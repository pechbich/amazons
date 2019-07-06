const width = 1024;
const height = 1024;

function start(size){
    canvas = document.getElementById("screen");    
    ctx = canvas.getContext("2d");    
    
    ctx.fillStyle = "green";
    map = new Map(size);

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        map.draw(ctx);
        setTimeout(gameLoop, 0.03);
    }

    setTimeout(gameLoop, 0.01);
}

function changePosition(object, newPosX, newPosY){
    object.PosX = newPosX;
    object.PosY = newPosY;
    // return object ?
}


class Map{
    constructor(size) {
        this.size = size;
        this.tiles = [];
        this.positionSelected = null;

        for (var i=0; i<size; i++) {
            this.tiles.push([]);
            for (var j=0; j<size; j++) {
                let white = (i+j)%2;
                if (white){
                    this.tiles[i].push(new Tile({x:i, y:j}, "#999966"));                    
                } else {
                    this.tiles[i].push(new Tile({x:i, y:j}, "#cc9900"));
                }
            }
        }
        canvas.addEventListener("click", function(event){
            var x = event.pageY - canvas.offsetTop,
                y = event.pageX - canvas.offsetLeft;
            var posX = Math.floor(x/(width/map.size)), // must be an easier way to do this
                posY = Math.floor(y/(width/map.size));
            map.changeSelection({x:posX, y:posY});
        }, false);
    }

    update() {
        // тут происходит вся логика игры
    }

    draw(canvas) {
        var width;
        width = 1024/this.size;        
        for (var i=0; i<this.size; i++) {
            for (var j=0; j<this.size; j++) {
                this.tiles[i][j].draw(canvas, j*width, i*width, width);
            }
        }
    }

    changeSelection(positionSelected){
        let map = this;
        function select(map, positionSelected){
            map.positionSelected = positionSelected;        
            map.tiles[positionSelected.x][positionSelected.y].bodyColour = "#cc0000";
        }
        function unselect(map){
            let oldTile = map.tiles[map.positionSelected.x][map.positionSelected.y];
            oldTile.bodyColour = oldTile.defaultBodyColour;
            map.positionSelected = null;
        }
        if (this.positionSelected !== null){
            if (this.positionSelected.x == positionSelected.x &&
                this.positionSelected.y == positionSelected.y){
                unselect(map);
            } else {
                unselect(map);
                select(map, positionSelected);
            }
        } else {
            select(map, positionSelected);
        }
    }
}


class Tile{
    borderColour = "#101010";

    constructor(position, bodyColour){
        this.position = position;
        this.bodyColour = bodyColour;
        this.figure = null;
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