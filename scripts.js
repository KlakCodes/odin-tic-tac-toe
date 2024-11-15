// The Gameboard represents the state of the board
function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  // Create a 2d array that will represent the state of the game board
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  // Get the game board in it's current state
  const getBoard = () => board;

  // Place a token on the board
  // Check if there is already a token in selected cell
  const placeToken = (row, column, player) => {
    if (board[row][column].getValue() !== 0) {
      console.log(`Cell [${row}][${column}] is already occupied!`);
      return;
    }

    board[row][column].addToken(player);
  };

  // Print board to the console
  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    console.log(boardWithCellValues);
  };

  // Provide an interface for the rest of the application to interact with the board
  return { getBoard, placeToken, printBoard };
}

// A cell represents each square of the board
function Cell() {
  let value = 0;

  // Accept a player's token to change the value of the cell
  const addToken = (player) => {
    value = player;
  };

  // Retrieve the current value of this cell through closure
  const getValue = () => value;

  return {
    addToken,
    getValue
  };
}

/* The GameController will be responsible for controlling the  flow and state of the game's
turns, as well as whether anybody has won the game */
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
    // Drop a token for the current player
    // If an invalid cell is chosen, ask the user to select a different cell
    if (board.getBoard()[row][column].getValue() !== 0) {
      console.log(`Cell [${row}][${column}] is already occupied! ${getActivePlayer().name}, please choose a different cell.`);
      return; // Do not switch the turn if the cell is occupied
    }

    console.log(
      `Placing ${getActivePlayer().name}'s token into cell [${row}][${column}]...`
    );
    board.placeToken(row, column, getActivePlayer().token);

    // Switch player turn
    switchPlayerTurn();
    printNewRound();
  };

  // Initial play game message
  printNewRound();

  return {
    playRound,
    getActivePlayer
  };
}

const game = GameController();