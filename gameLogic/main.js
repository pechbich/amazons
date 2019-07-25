const WIDTH = 1024;
const HEIGHT = 1024;

// загружаем ресурсы
BLACK_FIGURE = new Image();
BLACK_FIGURE.src = '/images/png/blkfig';
WHITE_FIGURE = new Image();
WHITE_FIGURE.src = '/images/png/whtfig';

// gotta let user select size and number of figures
// assuming the game is always for two players
function start(size, numOfFigures){
    canvas = document.getElementById("screen");    
    ctx = canvas.getContext("2d");  
    canvasData =  {
        canvas: canvas, 
        ctx: ctx,
        size: {
            width: WIDTH,
            height: HEIGHT
        }
    } 

    var menu = new Menu(
        canvasData, 
        [
            new MenuOption('alert', scene => {
                alert('hello')
            }),
            new MenuOption('Start Game', scene => {
                scene.changeScene(
                    new GameMap(
                        canvasData, 
                        size,  
                        {
                            white: new Player("white", numOfFigures),
                            black: new Player("black", numOfFigures) 
                        }
                    )
                )
            })
        ]);
    menu.show();
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


class GameMap extends Scene{
    constructor(canvasData, size, players) {
        super(canvasData);
        this.canvasData.size.tileSize = 1024/size;  
        this.size = size;
        this.tiles = [];
        this.positionSelected = null;
        this.selectTile = null;

        // подготавливаем тайлы
        for (var x=0; x<size; x++) {
            this.tiles.push([]);
            for (var y=0; y<size; y++) {
                let white = (x+y)%2;

                this.tiles[x].push(
                    new Tile(
                        {
                            x:x, 
                            y:y,
                            screenPosition: {
                                x: x*this.canvasData.size.tileSize,
                                y: y*this.canvasData.size.tileSize,
                                size: this.canvasData.size.tileSize
                            }
                        }, 
                        white?"#de8416":"#db9744"
                    )
                );
            }
        }

        // подготавливаем игроков
        this.players = players;
        for (var team in players) {
            let player = players[team];
            player.setMap(this);
        }
    }

    start() {
        // Этот метод вызывается при запуске сцены
        // .bind(this) устанавливает значение this внутри функции и возвращает новую функцию
        this.addEventListener("click", this.click.bind(this));
        this.draw()
    }

    click(event) {
        var x = event.pageX - canvas.offsetLeft,
            y = event.pageY - canvas.offsetTop;
        var posX = Math.floor(x/(WIDTH/this.size)),
            posY = Math.floor(y/(WIDTH/this.size));
        this.changeSelection({x:posX, y:posY});
    }

    update() {
        // тут происходит вся логика игры
    }

    draw() {
        // подготовка 
        var ctx = this.canvasData.ctx; 
        ctx.clearRect(0,0, this.canvasData.size.width, this.canvasData.size.height);
        
        // рисуем карту
        for (var i=0; i<this.size; i++) {
            for (var j=0; j<this.size; j++) {
                var currentTile = this.tiles[i][j]
                currentTile.draw(
                    this.canvasData, 
                    {
                        selected: this.selectTile==currentTile
                    });
            }
        }

        // рисуем игроков
        for (var team in this.players) {
            var player = this.players[team];

            player.draw(this.canvasData);
        }
    }

    changeSelection(pos){
        if (this.selectTile != null
            && this.selectTile.position.x == pos.x && this.selectTile.position.y == pos.y) {
            this.selectTile = null;
        } else {
            this.selectTile = this.getTile(pos.x, pos.y);
        }
        if (this.selectTile.figure){

            this.highlightAllMoves(this.selectTile);
        }
        this.draw();
    }

    highlightAllMoves(tile){
        //let startPos = tile.position, checkedPos = tile.position;
        let checkedPos = new Object(tile.position);        
        
            //console.log(`startpos ${startPos.x}, ${startPos.y}`);
        let directions = [[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[0,1],[1,1]];
        for (let direction of directions){
            
            while (true){
                let nextTile = this.stepIn(this.tiles[checkedPos.x][checkedPos.y], direction)             
                if (nextTile.isEmpty()){
                    nextTile.highlightMove();                        
                    console.log(`highlighted ${checkedPos.x}, ${checkedPos.y}`);
                } else {
                    break;
                }            
            checkedPos.x = tile.position.x;
            //console.log(startPos.x);
            checkedPos.y = tile.position.y;
            //console.log(startPos.y);
            //console.log(`reset to ${checkedPos.x}, ${checkedPos.y}`);
                
            }
        }
        
    } 

    stepIn(tile, direction){
        try {
            return this.tiles[tile.position.x+direction[0]][tile.position.y+direction[1]]
        } catch (e){
            if (e instanceof TypeError){
                return
            }
        } 
    }

        
    getTile(x, y) {
        return this.tiles[x][y];
    }
}


class Tile{
    borderColour = "#101010";
    selectColour = "#cc0000";
    movesColour = "#36a738";

    constructor(position, bodyColour){
        this.position = position;
        this.bodyColour = bodyColour;
        this.figure = null;
        this.defaultBodyColour = bodyColour;   
    }

    draw(canvasData, info) {
        var screen = this.getScreenPosition()

        canvasData.ctx.fillStyle = info.selected?this.selectColour:this.bodyColour;
        canvasData.ctx.fillRect(screen.x, screen.y, screen.size, screen.size);

        canvasData.ctx.fillStyle = this.borderColour;
        canvasData.ctx.rect(screen.x, screen.y, screen.size, screen.size);

        canvasData.ctx.stroke();
    }

    isEmpty(){
        return this.figure == null;
    }

    highlightMove(){
        this.bodyColour = this.movesColour;
    }

    takeFigureAway(){
        takenFigure = this.figure;
        this.figure == null;
        takenFigure.tile = null;
        return takenFigure;
    }

    placeFigureHere(figure){
        this.figure = figure;
        figure.tile = this;
    }

    getScreenPosition() {
        return this.position.screenPosition;
    }
}

class Figure {
    constructor(owner, initialPosition){
        this.owner = owner;
        this.tile = null;
        this.figureImage = owner.team=='white'?WHITE_FIGURE:BLACK_FIGURE;
        this.initialPosition = initialPosition;
    }
    
    draw(canvasData) {
        var ctx = canvasData.ctx;
        if (this.tile != null) {
            var position = this.getScreenPosition()
            ctx.drawImage(this.figureImage, position.x, position.y, position.size, position.size);
        }
    }

    getScreenPosition() {
        return this.tile.getScreenPosition();
    }
}

class Player {

    constructor(name, numOfFigures) {
        this.name = name;
        this.allFigures = [];
        this.numOfFigures = numOfFigures;
        var posXarray = shuffle();
        var posYarray = shuffle(); 

        for (var i = 0; i<this.numOfFigures; i++){
            var figure = new Figure(this, {x: posXarray[i], y: posYarray[i]});
            this.allFigures.push(figure);
        }
    }

    setMap(map) {
        this.map = map;   
        
        // запихиваем фигуры на тайлы
        for (var i = 0; i<this.numOfFigures; i++){
            var figure = this.allFigures[i];
            var tile = map.getTile(figure.initialPosition.x, figure.initialPosition.y);
            tile.placeFigureHere(figure);
        }
    }

    moveFigure(fromTile, toTile){
        if (toTile.isEmpty()){
            takenFigure = fromTile.takeFigureAway();        
            toTile.placeFigureHere(takenFigure);
        }
    }

    draw(ctx) {
        for (var i=0; i<this.numOfFigures; i++) {
            var figure = this.allFigures[i];
            figure.draw(ctx);
        }
    }

}