const width = 1024;
const height = 1024;

// gotta let user select size and number of figures
// assuming the game is always for two players
function start(size, numOfFigures){
    canvas = document.getElementById("screen");    
    ctx = canvas.getContext("2d");    
    
    ctx.fillStyle = "green";
    map = new Map(size);
    players = [new Player("white", numOfFigures),
                    new Player("black", numOfFigures)];

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        map.draw(ctx);
        setTimeout(gameLoop, 0.03);
    }

    setTimeout(gameLoop, 0.01);
}

function shuffle(){
    //copypasted from SO
    var array = [0,1,2,3,4,5,6,7]; //hardcoded board size for now
    var counter = array.length,
    temp, index;
    

    // While there are elements in the array
    while (counter > 0) {
    // Pick a random index
        index = Math.floor(Math.random() * (counter + 1));
    
    // Decrease counter by 1
        counter--;
    
    // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array
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
                    this.tiles[i].push(new Tile({x:i, y:j}, "#de8416"));                    
                } else {
                    this.tiles[i].push(new Tile({x:i, y:j}, "#db9744"));
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
        //var fig = new Figure("white");
        //canvas.drawImage(fig.figureImage, offsetX, offsetY, size, size);
        /* for (let i=0; i<whitePlayer.allFigures.length; i++){
            if (this.position.x == whitePlayer.allFigures[i].position.x
                && this.position.y == whitePlayer.allFigures[i].position.y){
                canvas.drawImage(whitePlayer.allFigures[i].figureImage, offsetX, offsetY, size, size); 
            }
        }
        for (let i=0; i<blackPlayer.allFigures.length; i++){
            if (this.position == blackPlayer.allFigures[i].position
                && this.position.y == blackPlayer.allFigures[i].position.y){
                canvas.drawImage(blackPlayer.allFigures[i].figureImage, offsetX, offsetY, size, size); 
            }
        } */
        for (let i=0; i<players.length; i++){
            for (let j=0; j<players[i].allFigures.length; j++){
                if (this.position.x == players[i].allFigures[j].position.x
                    && this.position.y == players[i].allFigures[j].position.y){
                        canvas.drawImage(players[i].allFigures[j].figureImage, offsetX, offsetY, size, size);
                    }
            }
        }
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
        
    constructor(team, position){
        this.position = position
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
        var posXarray = shuffle();
        var posYarray = shuffle();      
        for (var i = 0; i<numOfFigures; i++){
            this.allFigures.push(new Figure(this.team, {x: posXarray[i], y:posYarray[i]}));
            //console.log("figure's position: {"+this.allFigures[i].position.x+", "+this.allFigures[i].position.y+"}");
        }
    }

    moveFigure(fromTile, toTile){
        if (toTile.isEmpty()){
            takenFigure = fromTile.takeFigureAway();        
            toTile.placeFigureHere(takenFigure);
        }
    }

}