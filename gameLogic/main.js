/* eslint-env browser */
/* global Menu */
/* global MenuOption */
/* global socket */
/* global Scene */
/* global initSocket */

const WIDTH = 640
const HEIGHT = 640

// загружаем ресурсы
const BLACK_FIGURE = new Image()
BLACK_FIGURE.src = '/images/png/blkfig'
const WHITE_FIGURE = new Image()
WHITE_FIGURE.src = '/images/png/whtfig'

// координаты выделенного тайла с фигурой
var oldX = null
var oldY = null

// выбранный тайл для хода 
var selectedTile = null

// возможные тайлы для хода
var tilesToMove = []

function drawSquare(canvasData, color, tile) {
    var screen = tile.getScreenPosition()

    canvasData.ctx.fillStyle = color
    canvasData.ctx.fillRect(screen.x, screen.y, screen.size, screen.size)

    canvasData.ctx.fillStyle = '#101010'
    canvasData.ctx.rect(screen.x, screen.y, screen.size, screen.size)

    canvasData.ctx.stroke()
}

// gotta let user select size and number of figures
// assuming the game is always for two players
function start (size, numOfFigures) {
  var canvas = document.getElementById('screen')
  var ctx = canvas.getContext('2d')
  var canvasData = {
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
        socket.emit('lookForGame', {
          boardSize: {
            width: size,
            height: size
          },
          numOfFigures: numOfFigures
        })

        socket.on('gameFound', event => {
          scene.changeScene(
            new GameMap(
              canvasData,
              size,
              event.playerPositions,
              event.color
            )
          )
        })
      })
    ])
  menu.show()
}

class GameMap extends Scene {
  constructor (canvasData, size, positions, color) {
    super(canvasData)
    this.positionSelected = null
    this.selectTile = null

    this.notifyServer = initSocket(this)

    this.canvasData.size.tileSize = WIDTH / size
    this.size = size
    this.tiles = []
    this.color = color

    this._placeTiles(size)

    this._placePlayers(positions)
  }

  _placeTiles (size) {
    for (var x = 0; x < size; x++) {
      this.tiles.push([])
      for (var y = 0; y < size; y++) {
        const white = (x + y) % 2

        this.tiles[x].push(
          new Tile(
            {
              x: x,
              y: y,
              screenPosition: {
                x: x * this.canvasData.size.tileSize,
                y: y * this.canvasData.size.tileSize,
                size: this.canvasData.size.tileSize
              }
            },
            white ? '#de8416' : '#db9744'
          )
        )
      }
    }
  }

  _placePlayers (positions) {
    this.players = {
      white: new Player(
        'white',
        positions.white
      ),
      black: new Player(
        'black',
        positions.black
      )
    }
    for (var team in this.players) {
      this.players[team].setMap(this)
    }
  }

  start () {
    // Этот метод вызывается при запуске сцены
    // .bind(this) устанавливает значение this внутри функции и возвращает новую функцию
    this.addEventListener('click', this.click.bind(this))
    this.draw()
  }

  click (event) {
    var x = event.pageX - this.canvasData.canvas.offsetLeft
    var y = event.pageY - this.canvasData.canvas.offsetTop
    var posX = Math.floor(x / (WIDTH / this.size))
    var posY = Math.floor(y / (WIDTH / this.size))

    selectedTile = this.getTile(posX, posY)
    if (selectedTile.isEmpty()) {

      if (oldX != null && oldY != null) {

        var tile0 = this.getTile(oldX, oldY)

        if (tilesToMove.includes(selectedTile)) {
          tile0.figure.owner.moveFigure(tile0, selectedTile)

          // send this to server
          console.log({start: {x: oldX, y: oldY}, end: {x: posX, y: posY}})
        }
      }
      oldY = null
      oldY = null
      tilesToMove = []    
    }
    else {
      oldX = posX
      oldY = posY 
      tilesToMove = this.getAllPossibleTilesToAct(this.getTile(oldX, oldY), tile => tile.isEmpty())
    }

    this.draw()
 
  }

  update () {
    // тут происходит вся логика игры
  }

  draw () {
    // подготовка
    var ctx = this.canvasData.ctx
    ctx.clearRect(0, 0, this.canvasData.size.width, this.canvasData.size.height)

    // рисуем карту
    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        var currentTile = this.tiles[i][j]
        currentTile.draw(
          this.canvasData,
          {
            selected: this.selectTile === currentTile
          })
      }
    }

    // возможные ходы
    for (var t in tilesToMove) {
      var tt = tilesToMove[t]
      drawSquare(this.canvasData,'#00cc00', tt)
    }

    // выделение
    if (selectedTile != null) drawSquare(this.canvasData,'#cc0000', selectedTile)
    

    // рисуем игроков
    for (var team in this.players) {
      var player = this.players[team]

      player.draw(this.canvasData)
    }
  }

  // changeSelection (pos) {
  //   if (pos.color === this.color) return

  //   if (this.selectTile != null && this.selectTile.position.x === pos.x && this.selectTile.position.y === pos.y) {
  //     if (this.selectTile.hasFigure()) {
  //       this.highlightPossibleTiles(false)
  //     }
  //     this.selectTile = null
  //   } else {
  //     if (this.selectTile !== null && this.selectTile.hasFigure()) {
  //       this.highlightPossibleTiles(false)
  //     }

  //     this.selectTile = this.getTile(pos.x, pos.y)

  //     if (this.selectTile.hasFigure()) {
  //       if (this.selectTile.figure.getHighlightableTiles() === null) {
  //         var tiles = this.getAllPossibleTilesToAct(this.selectTile, tile => tile.isEmpty())
  //         this.selectTile.figure.setHighlitableTiles(tiles)
  //       }

  //       this.highlightPossibleTiles(true)
  //     }
  //   }
  //   this.draw()
  // }

  // highlightPossibleTiles (b) {
  //   var tiles = this.selectTile.figure.getHighlightableTiles()

  //   if (tiles !== null && tiles.length > 0) {
  //     tiles.forEach(tile => tile.highlightMove(b))
  //   }
  // }

  getAllPossibleTilesToAct (tile, cond) {
    const directions = [[1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1]]
    var result = []
    for (const direction of directions) {
      var currentTile = this.getTile(tile.position.x, tile.position.y)

      while (true) {
        currentTile = this.stepIn(currentTile, direction)

        if (currentTile == null || !cond(currentTile)) {
          break
        }

        result.push(currentTile)
      }
    }

    return result
  }

  stepIn (tile, direction) {
    try {
      return this.getTile(tile.position.x + direction[0], tile.position.y + direction[1])
    } catch (e) {
      if (e instanceof TypeError) {

      }
    }
  }

  getTile (x, y) {
    if (x >= 0 && y >= 0 && x < this.size && y < this.size) {
      return this.tiles[x][y]
    }
    return null
  }
}

class Tile {
  constructor (position, bodyColour) {
    this.borderColour = '#101010'
    this.selectColour = '#cc0000'
    this.movesColour = '#36a738'

    this.position = position
    this.bodyColour = bodyColour
    this.figure = null
    this.defaultBodyColour = bodyColour
  }

  draw (canvasData, info) {
    var screen = this.getScreenPosition()

    canvasData.ctx.fillStyle = info.selected ? this.selectColour : this.bodyColour
    canvasData.ctx.fillRect(screen.x, screen.y, screen.size, screen.size)

    canvasData.ctx.fillStyle = this.borderColour
    canvasData.ctx.rect(screen.x, screen.y, screen.size, screen.size)

    canvasData.ctx.stroke()
  }

  isEmpty () {
    return this.figure == null
    // здесь еще будет проверка на огонь
  }

  hasFigure () {
    return this.figure !== null
  }

  highlightMove (b) {
    if (b) {
      this._bodyColor = this.bodyColour
      this.bodyColour = this.movesColour
    } else {
      this.bodyColour = this._bodyColor
    }
  }

  takeFigureAway () {
    var takenFigure = this.figure
    this.figure = null
    takenFigure.tile = null
    return takenFigure
  }

  placeFigureHere (figure) {
    this.figure = figure
    figure.tile = this
  }

  getScreenPosition () {
    return this.position.screenPosition
  }
}

class Figure {
  constructor (owner, initialPosition) {
    this.owner = owner
    this.tile = null
    this.figureImage = owner.team === 'white' ? WHITE_FIGURE : BLACK_FIGURE
    this.initialPosition = initialPosition

    this.highlightableTiles = null
  }

  draw (canvasData) {
    var ctx = canvasData.ctx
    if (this.tile != null) {
      var position = this.getScreenPosition()
      ctx.drawImage(this.figureImage, position.x, position.y, position.size, position.size)
    }
  }

  getScreenPosition () {
    return this.tile.getScreenPosition()
  }

  setHighlitableTiles (tiles) {
    this.highlightableTiles = tiles
  }

  getHighlightableTiles () {
    return this.highlightableTiles
  }
}

class Player {
  constructor (team, figuresPlaces) {
    this.team = team
    this.allFigures = []
    this.numOfFigures = figuresPlaces.length

    for (var i = 0; i < figuresPlaces.length; i++) {
      var figure = new Figure(this, figuresPlaces[i])
      this.allFigures.push(figure)
    }
  }

  setMap (map) {
    this.map = map

    // запихиваем фигуры на тайлы
    for (var i = 0; i < this.numOfFigures; i++) {
      var figure = this.allFigures[i]
      var tile = map.getTile(figure.initialPosition.x, figure.initialPosition.y)
      tile.placeFigureHere(figure)
    }
  }

  moveFigure (fromTile, toTile) {
    if (toTile.isEmpty()) {
      var takenFigure = fromTile.takeFigureAway()
      toTile.placeFigureHere(takenFigure)
    }
  }

  draw (ctx) {
    for (var i = 0; i < this.numOfFigures; i++) {
      var figure = this.allFigures[i]
      figure.draw(ctx)
    }
  }
}

start(8, 2)
