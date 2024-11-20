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
    getActivePlayer,
    getBoard: board.getBoard
  };
}

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.board');

  const updateScreen = () => {
    // Clear the board
    boardDiv.textContent = "";

    // Get the newest version of the board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // Display player's turn
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    // Render board cells
    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");

        // Create a data attribute to identify the column and row
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;

        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      })
    })
  }

  // Add event listener for the board
  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;

    // Make sure a cell is clicked and not the board border
    if (!selectedRow || !selectedColumn) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  // Initial render
  updateScreen();
}

ScreenController();