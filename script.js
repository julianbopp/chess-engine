// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

import { Chess } from './lib/chess.js/chess.js'

var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')
var $minmax = $('#minmax')
var $alphabeta = $('#alphabeta')

// AI part

function getNextMove (alphabeta, depth) {
  var possibleMoves = game.moves()
  var bestMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]

  // var currentScore = -evaluateBoard(game.board())
  // for (let i = 0; i < possibleMoves.length; i++) {
  //   let move = possibleMoves[i]
  //   game.move(move);
  //   var newScore = -evaluateBoard(game.board())
  //   game.undo();
  //   if (newScore > currentScore) {
  //     currentScore = newScore;
  //     bestMove = move;
  //   }
  // }
  if (alphabeta) {
    var maybe = alphabetaRoot(depth, false)
  } else {
    var maybe = minimaxRoot(depth, false)
  }
  if (!(maybe === null)) {
    return maybe
  }
  return bestMove

}

function minimaxRoot (depth, maximizingPlayer) {
  let bestMove = null
  let bestScore
  if (maximizingPlayer) {
    bestScore = -99999
  } else {
    bestScore = 99999
  }

  const possibleMoves = game.moves()
  for (let i = 0; i < possibleMoves.length; i++) {
    let move = possibleMoves[i]

    game.move(move)
    let score = minimax(depth - 1, !maximizingPlayer)
    game.undo()

    if (score >= bestScore && maximizingPlayer) {
      bestScore = score
      bestMove = move
    }

    if (score <= bestScore && !maximizingPlayer) {
      bestScore = score
      bestMove = move
    }
  }
  return bestMove
}

function alphabetaRoot (depth, maximizingPlayer) {
  let bestMove = null
  let bestScore
  if (maximizingPlayer) {
    bestScore = -99999
  } else {
    bestScore = 99999
  }

  const possibleMoves = game.moves()
  for (let i = 0; i < possibleMoves.length; i++) {
    let move = possibleMoves[i]

    game.move(move)
    let score = alphabeta(depth - 1, -10000, 10000, !maximizingPlayer)
    game.undo()

    if (score >= bestScore && maximizingPlayer) {
      bestScore = score
      bestMove = move
    }

    if (score <= bestScore && !maximizingPlayer) {
      bestScore = score
      bestMove = move
    }
  }
  return bestMove
}

var alphabetacount = 0

function alphabeta (depth, alpha, beta, maximizingPlayer) {
  alphabetacount++
  if (depth === 0) {
    return evaluateBoard(game.board())
  }

  const possibleMoves = game.moves()
  if (maximizingPlayer) {
    let maxScore = -99999

    for (let i = 0; i < possibleMoves.length; i++) {
      let move = possibleMoves[i]
      game.move(move)
      maxScore = Math.max(maxScore, alphabeta(depth - 1, alpha, beta, !maximizingPlayer))
      game.undo()
      alpha = Math.max(alpha, maxScore)

      if (beta <= alpha) {
        return maxScore
      }
    }
    return maxScore
  } else {
    let maxScore = 99999

    for (let i = 0; i < possibleMoves.length; i++) {
      let move = possibleMoves[i]
      game.move(move)
      maxScore = Math.min(maxScore, alphabeta(depth - 1, alpha, beta, !maximizingPlayer))
      game.undo()
      beta = Math.min(beta, maxScore)
      if (beta <= alpha) {
        return maxScore
      }
    }
    return maxScore
  }

}

var minimaxcount = 0

function minimax (depth, maximizingPlayer) {
  minimaxcount++
  if (depth === 0) {
    return evaluateBoard(game.board())
  }

  if (maximizingPlayer) {
    let maxScore = -99999
    const possibleMoves = game.moves()

    for (let i = 0; i < possibleMoves.length; i++) {
      let move = possibleMoves[i]
      game.move(move)
      let score = minimax(depth - 1, false)
      game.undo()

      if (score >= maxScore) {
        maxScore = score
      }
    }
    return maxScore
  } else {
    let minScore = 99999
    const possibleMoves = game.moves()

    for (let i = 0; i < possibleMoves.length; i++) {
      let move = possibleMoves[i]
      game.move(move)
      let score = minimax(depth - 1, true)
      game.undo()

      if (score <= minScore) {
        minScore = score
      }
    }
    return minScore
  }
}

function evaluateBoard (gameboard) {
  let score = 0
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (true) {
        score = score + getPieceValue(gameboard[i][j], i, j)
      }
    }
  }
  return score
}

var reverseArray = function (array) {
  return array.slice().reverse()
}

var pawnEvalWhite =
  [
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
    [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
    [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
    [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
    [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
    [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
  ]

var pawnEvalBlack = reverseArray(pawnEvalWhite)

var knightEval =
  [
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
    [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
    [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
    [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
    [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
    [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
    [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
  ]

var bishopEvalWhite = [
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
  [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
  [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
  [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
  [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
  [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
]

var bishopEvalBlack = reverseArray(bishopEvalWhite)

var rookEvalWhite = [
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0]
]

var rookEvalBlack = reverseArray(rookEvalWhite)

var evalQueen =
  [
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
  ]

var kingEvalWhite = [

  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
  [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
  [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
  [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0]
]

var kingEvalBlack = reverseArray(kingEvalWhite)

function getPieceValue (piece, x, y) {
  let value = 0
  if (piece === null) {
    return value
  }

  if (piece.type === 'p') {
    value = 10 + (piece.color === 'w' ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x])
  } else if (piece.type === 'r') {
    value = 50 + (piece.color === 'w' ? rookEvalWhite[y][x] : rookEvalBlack[y][x])
  } else if (piece.type === 'n') {
    value = 30 + (piece.color === 'w' ? knightEval[y][x] : knightEval[y][x]);
  } else if (piece.type === 'b') {
    value = 30 + (piece.color === 'w' ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x]);
  } else if (piece.type === 'q') {
    value = 90 + (piece.color === 'w' ? evalQueen[y][x] : evalQueen[y][x]);
  } else if (piece.type === 'k') {
    value = 900 + (piece.color === 'w' ? kingEvalWhite[y][x] : kingEvalBlack[y][x]);
  }
  return piece.color === 'w' ? value : -value

}

//

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for white
  if ((piece.search(/^b/) !== -1)) {
    return false
  }
}

function onDrop (source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  updateStatus()
  window.setTimeout(MakeBestMove, 250)

}

function MakeBestMove () {
  let depth = 3
  let alphabeta = true
  var bestMove = getNextMove(alphabeta, depth)
  game.move(bestMove)
  board.position(game.fen())
  if (game.game_over()) {
    alert('Game over')
  }
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())
}

function updateStatus () {
  var status = ''

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game over, drawn position'
  }

  // game still on
  else {
    status = moveColor + ' to move'

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check'
    }
  }

  $status.html(status)
  $fen.html(game.fen())
  $pgn.html(game.pgn())
  $minmax.html(minimaxcount)
  $alphabeta.html(alphabetacount)
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}
board = Chessboard('myBoard', config)
updateStatus()

