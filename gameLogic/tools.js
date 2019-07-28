module.exports = {
  getPositions: function (size, num) {
    var i = 0
    var allPossibles = Array.from(Array(size * size), function () { return { x: Math.floor(i / size), y: ++i % size } }).sort(x => 0.5 - Math.random())
    return {
      white: allPossibles.slice(0, num),
      black: allPossibles.slice(num, num * 2)
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
