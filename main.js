var n = 4;

// Precalculate all possible boards.
var allPossibleBoards = (function () {
  var results = [];
  var board = [];
  for (var k = 0; k < n; k++) {
    board.push(null);
  }

  var nQueens = function (currentColumn) {
    results.push(board.slice());
    if (currentColumn === n) {
      return;
    } else {
      for (var i = 0; i < n; i++) {
        board[currentColumn] = i;
        nQueens(currentColumn + 1);
        board[currentColumn] = null;
      }
    }
  };

  nQueens(0);
  return results;
}());

var pause = false;

var dt = new DecisionTree(allPossibleBoards.shift());

var interval = setInterval(function () {
  if (pause || allPossibleBoards.length === 0) return;
  var b = allPossibleBoards.shift();
  dt.update(b);
}, 1500);
