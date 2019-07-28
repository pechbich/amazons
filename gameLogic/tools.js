module.exports = {
  getPositions: function (rule) {
    var i = 0
    var allPossibles = Array.from(
      Array(rule.boardSize.width * rule.boardSize.height), // создаем массив
      function () { // заполняем его
        return {
          x: Math.floor(i / rule.boardSize.width),
          y: ++i % rule.boardSize.width
        }
      }).sort(x => 0.5 - Math.random()) // перемешиваем
    return {
      white: allPossibles.slice(0, rule.numOfFigures),
      black: allPossibles.slice(rule.numOfFigures, rule.numOfFigures * 2)
    }
  },

  popRandomFromSet: function (set) {
    const items = Array.from(set)
    var value = items[Math.floor(Math.random() * items.length)]
    set.delete(value)
    return value
  },

  findOppenent: function (games, client) {
    for (var i = 0; i < games.length; i++) {
      var game = games[i]

      if (game.white === client) {
        return game.black
      }

      if (game.black === client) {
        return game.white
      }
    }
  }
}
