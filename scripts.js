function Gameboard() {
  const rows = 3;
  const columns = 3;

  // const board = Array.from(Array(rows), () => new Array(columns));
  // board[0][0] = 'test';
  // console.info(board);

  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const placeToken = (row, column, player) => {
    if (board[row][column].getValue() !== 0) {
      console.log(`Cell [${row}][${column}] is already occupied!`);
      return;
    }

    board[row][column].addToken(player);
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    console.log(boardWithCellValues);
  };

  return { getBoard, placeToken, printBoard };
}

function Cell() {
  let value = 0;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addToken,
    getValue
  };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: 'O'
    },
    {
      name: playerTwoName,
      token: 'X'
    }
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    if (board.getBoard()[row][column].getValue() !== 0) {
      console.log(`Cell [${row}][${column}] is already occupied! ${getActivePlayer().name}, please choose a different cell.`);
      return; // Do not switch the turn if the cell is occupied
    }

    console.log(
      `Placing ${getActivePlayer().name}'s token into cell [${row}][${column}]...`
    );
    board.placeToken(row, column, getActivePlayer().token);

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer
  };
}

const game = GameController();