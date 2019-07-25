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
                var i=0;
                var allPossibles = Array.from(Array(size*size), function () {return {x: Math.floor(i/size), y: ++i%size}}).sort(x=>0.5-Math.random());
                console.log(allPossibles);

                scene.changeScene(
                    new GameMap(
                        canvasData, 
                        size,  
                        {
                            white: new Player(
                                "white", 
                                allPossibles.slice(0, numOfFigures)
                            ),
                            black: new Player(
                                "black", 
                                allPossibles.slice(numOfFigures, 2*numOfFigures)
                            ) 
                        }
                    )
                )
            })
        ]);
    menu.show();
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
        if (this.selectTile != null && this.selectTile.position.x == pos.x && this.selectTile.position.y == pos.y) {
            
            if (this.selectTile.hasFigure()) {
                this.highlightPossibleTiles(false);
            }
            this.selectTile = null;
        } 
        else {
            if (this.selectTile !== null && this.selectTile.hasFigure()) {
                this.highlightPossibleTiles(false);
            }

            this.selectTile = this.getTile(pos.x, pos.y);

            if (this.selectTile.hasFigure()){
                if (this.selectTile.figure.getHighlightableTiles() === null) {
                    var tiles = this.getAllPossibleTilesToAct(this.selectTile, tile => tile.isEmpty());
                    this.selectTile.figure.setHighlitableTiles(tiles);
                }
                
                this.highlightPossibleTiles(true);
            }
        }
        this.draw();
    }

    highlightPossibleTiles(b) {
        var tiles = this.selectTile.figure.getHighlightableTiles();

        if (tiles !== null && tiles.length>0) {
            tiles.forEach(tile => tile.highlightMove(b));
        }
    }

    getAllPossibleTilesToAct(tile, cond){   
        let directions = [[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[0,1],[1,1]];
        var result = [];
        for (let direction of directions){
            var currentTile = this.getTile(tile.position.x,tile.position.y);

            while (true){
                currentTile = this.stepIn(currentTile, direction);

                if (currentTile == null || !cond(currentTile)){
                    break;
                }

                result.push(currentTile);                     
            }
        }

        return result;
    } 

    stepIn(tile, direction){
        try {
            return this.getTile(tile.position.x+direction[0], tile.position.y+direction[1])
        } catch (e){
            if (e instanceof TypeError){
                return
            }
        } 
    }

        
    getTile(x, y) {
        if (x>=0 && y>=0 && x<this.size && y<this.size) {
            return this.tiles[x][y];
        }
        return null;
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
        // здесь еще будет проверка на огонь
    }

    hasFigure() {
        return this.figure !== null;
    }

    highlightMove(b){
        if (b) {
            this._bodyColor = this.bodyColour;
            this.bodyColour = this.movesColour;
        }
        else {
            this.bodyColour = this._bodyColor;
        }
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

        this.highlightableTiles = null;
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

    setHighlitableTiles(tiles) {
        this.highlightableTiles = tiles;
    }

    getHighlightableTiles() {
        return this.highlightableTiles;
    }
}

class Player {
    constructor(team, figuresPlaces) {
        this.team = team;
        this.allFigures = [];
        this.numOfFigures = figuresPlaces.length;
        
        for (var i = 0; i<figuresPlaces.length; i++){
            console.log(figuresPlaces[i]+"");
            var figure = new Figure(this, figuresPlaces[i]);
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