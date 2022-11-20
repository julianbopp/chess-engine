// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

import { Chess } from './lib/chess.js/chess.js'

var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')


// AI part


function getNextMove() {
  const possibleMoves = game.moves()
  return possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
}

function evaluateBoard() {
  let score = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      score = score + getPieceValue(board[i][j]);
    }
  }
}

function getPieceValue(piece) {
  let value = 0;
  if (piece === null) {
    return value;
  }

  if (piece.type === "r") {
    value = 10;
  } else if (piece.type === 'r') {
    value = 50;
  } else if (piece.type === 'n') {
    value = 30;
  } else if (piece.type === 'b') {
    value = 30 ;
  } else if (piece.type === 'q') {
    value = 90;
  } else if (piece.type === 'k') {
    value = 900;
  }

  if (piece.color === "w") {
    return value;
  } else {
    return -value;
  }


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


  game.move(getNextMove());
  updateStatus()
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

