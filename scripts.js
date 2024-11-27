let playerOneName;
let playerTwoName;

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
    if (board[row][column].getValue() !== '') {
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
  let value = '';

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

  const checkWinner = () => {
    const boardState = board.getBoard();

    // Check rows
    for (let row = 0; row < 3; row++) {
      if (boardState[row][0].getValue() === boardState[row][1].getValue() &&
        boardState[row][1].getValue() === boardState[row][2].getValue() &&
        boardState[row][0].getValue() !== '') {
        return true; // Row win
      }
    }

    // Check columns
    for (let col = 0; col < 3; col++) {
      if (boardState[0][col].getValue() === boardState[1][col].getValue() &&
        boardState[1][col].getValue() === boardState[2][col].getValue() &&
        boardState[0][col].getValue() !== '') {
        return true; // Column win
      }
    }

    // Check diagonals
    if (boardState[0][0].getValue() === boardState[1][1].getValue() &&
      boardState[1][1].getValue() === boardState[2][2].getValue() &&
      boardState[0][0].getValue() !== '') {
      return true; // Diagonal win (top-left to bottom-right)
    }

    if (boardState[0][2].getValue() === boardState[1][1].getValue() &&
      boardState[1][1].getValue() === boardState[2][0].getValue() &&
      boardState[0][2].getValue() !== '') {
      return true; // Diagonal win (top-right to bottom-left)
    }

    return false; // No winner
  };

  const checkDraw = () => {
    const boardState = board.getBoard();
  
    // Check if there are any empty cells left
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (boardState[row][col].getValue() === '') {
          return false; // There is still an empty cell, so it's not a draw
        }
      }
    }
  
    return true; // All cells are filled
  };
  

  const playRound = (row, column) => {
    // Drop a token for the current player
    // If an invalid cell is chosen, ask the user to select a different cell
    if (board.getBoard()[row][column].getValue() !== '') {
      console.log(`Cell [${row}][${column}] is already occupied! ${getActivePlayer().name}, please choose a different cell.`);
      return; // Do not switch the turn if the cell is occupied
    }

    console.log(
      `Placing ${getActivePlayer().name}'s token into cell [${row}][${column}]...`
    );
    board.placeToken(row, column, getActivePlayer().token);

    // Check if the current player has won
    if (checkWinner()) {
      console.log(`${getActivePlayer().name} wins!`);
      return true; // End the game if there's a winner
    }

    if (checkDraw()) {
      console.log("It's a draw!");
      gameOver = true;  // Mark the game as over
      return true; // End the game if it's a draw
    }

    // Switch player turn
    switchPlayerTurn();
    printNewRound();
    return false;
  };

  // Initial play game message
  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    checkWinner
  };
}

function ScreenController(playerOne, playerTwo) {
  const game = GameController(playerOne, playerTwo);
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.board');
  let gameOver = false;

  const updateScreen = () => {
    // Clear the board
    boardDiv.textContent = "";

    // Get the newest version of the board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // Display player's turn
    if (!gameOver) {
      playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
    }

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
    });

    // If the game is over display winner message and disable the board
    // if (gameOver) {
    //   playerTurnDiv.textContent = `${activePlayer.name} wins!`;
    //   disableBoard();
    // }
    if (gameOver) {
      if (game.checkWinner()) {
        playerTurnDiv.textContent = `${activePlayer.name} wins!`;
      } else {
        playerTurnDiv.textContent = "It's a draw!";
      }
      disableBoard();
    }
  };

  const disableBoard = () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
      cell.disabled = true;
    });
  };

  // Add event listener for the board
  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;

    // Make sure a cell is clicked and not the board border
    if (!selectedRow || !selectedColumn) return;

    const gameWon = game.playRound(selectedRow, selectedColumn);

    if (gameWon) {
      gameOver = true;
    }

    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  // Initial render
  updateScreen();
}

ScreenController();

// Button Event Listeners
const gameSetup = document.querySelector('dialog');

document.querySelector("#newGame").addEventListener("click", () => {
  gameSetup.showModal();
});

document.querySelector('#new_game').addEventListener("submit", function(e) {
  e.preventDefault();
  playerOneName = document.querySelector('#playerOne').value;
  playerTwoName = document.querySelector('#playerTwo').value;
  ScreenController(playerOneName, playerTwoName);
  gameSetup.close();
  resetUserInputs();
});

document.querySelector('.closeDialog').addEventListener("click", () => {
  gameSetup.close();
  resetUserInputs();
})

document.querySelector('#restartGame').addEventListener("click", () => {
  ScreenController(playerOneName, playerTwoName);
});

// When called reset all inputs to clear
function resetUserInputs() {
  document.querySelector('#playerOne').value = '';
  document.querySelector('#playerTwo').value = '';
};