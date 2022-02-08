// special case game rules
// 1) if promote pawn to queen and have capturing a another pawn, I don't have additional move
// 2) I win when opponent don't have any move
// 3) When I have double beating, I show only one beat and after beat - automatically select my pawn and appear additional button to "end turn"

const chessboardEl = document.getElementsByClassName("chessboard")[0];
const rowsNumber = document.getElementById("noOfRows");
const colsNumber = document.getElementById("noOfColumns");
const pawnsNumber = document.getElementById("noOfPawns");

const PLAYERS = {
  WHITE: "white",
  BLACK: "black",
};

let turn = PLAYERS.WHITE;

setup();

function setup() {
  colorTheFields(8, 8);
  attachListeners();
}

function colorTheFields(chessboardRows = 8, chessboardColumns = 8) {
  const fields = document.querySelectorAll(".chessboard .field");
  for (let row = 0; row < chessboardRows; row++) {
    for (let column = 0; column < chessboardColumns; column++) {
      const index = row * chessboardColumns + column;
      colorTheField(fields[index], row, column);
    }
  }
}

function colorTheField(fieldEl, row, column) {
  const fieldColor = (row + column) % 2 ? "blackField" : "whiteField";
  fieldEl.classList.add(fieldColor);
}

function attachListeners() {
  const fields = document.querySelectorAll(".chessboard .field");
  fields.forEach((el) => {
    el.addEventListener("click", handleClick);
  });
}

function handleClick() {
  const clickedPawn = this.children[0];
  const selectedPawn = document.querySelector(".field .fieldSelected");
  const isCurrentPlayerPawnClicked = clickedPawn?.classList.contains(turn);
  const isPossibleMoveFieldClicked = this.classList.contains("canMove");
  // if (clicked on own pawn) OR (clicked on canMove field) then execute rest of the function
  if (!isCurrentPlayerPawnClicked && !isPossibleMoveFieldClicked) return;

  if (isCurrentPlayerPawnClicked) {
    handleCurrentPlayerPawnClick(this);
  } else if (isPossibleMoveFieldClicked) {
    handleHolderPawnClicked(clickedPawn, selectedPawn);
  }
}

function handleCurrentPlayerPawnClick(fieldClicked) {
  const isSelectPawnClicked = fieldClicked.classList.contains("fieldSelected");
  if (isSelectPawnClicked) {
    removeAllHolderPawns();
    removeSelection(fieldClicked);
  } else {
    removeAllPawnSelected();
    addSelection(fieldClicked);
    addAllPossibleMoves(fieldClicked);
  }
}

function removeAllHolderPawns() {
  const canMoveElements = document.querySelectorAll(".canMove");
  canMoveElements.forEach((el) => el.remove());
}

function removeSelection(fieldClicked) {
  fieldClicked.classList.remove("fieldSelected");
}

function removeAllPawnSelected() {
  const currentPlayerPawns = document.querySelectorAll(".fieldSelected");
  currentPlayerPawns.forEach((pawnEl) =>
    pawnEl.classList.remove("fieldSelected")
  );
}
function addSelection(fieldClicked) {
  fieldClicked.classList.add("fieldSelected");
}

function addAllPossibleMoves(fieldClicked) {
  const clickedPawn = fieldClicked.children[0];
  let player;
  let avaidableMoves = [];
  if (clickedPawn.classList.contains(PLAYERS.WHITE)) {
    player = PLAYERS.WHITE;
    const isQueen = clickedPawn.classList.contains("queen");
    if (isQueen) {
      avaidableMoves.push(...getNormalMoves(clickedPawn, player, isQueen));
      avaidableMoves.push(...getTheBeatingMoves(clickedPawn, player, isQueen));
    } else {
      avaidableMoves.push(...getNormalMoves(clickedPawn, player, isQueen));
      avaidableMoves.push(...getTheBeatingMoves(clickedPawn, player, isQueen));
    }
  } else if (clickedPawn.classList.contains(PLAYERS.BLACK)) {
    player = PLAYERS.BLACK;
    const isQueen = clickedPawn.classList.contains("queen");
    if (isQueen) {
      avaidableMoves.push(...getNormalMoves(clickedPawn, player, isQueen));
      avaidableMoves.push(...getTheBeatingMoves(clickedPawn, player, isQueen));
    } else {
      avaidableMoves.push(...getNormalMoves(clickedPawn, player, isQueen));
      avaidableMoves.push(...getTheBeatingMoves(clickedPawn, player, isQueen));
    }
  }
  attachMoves(avaidableMoves, player);
}
// TODO 1a
function getNormalMoves(clickedPawn, player, isQueen) {
  return [];
}
// TODO 1b
function getTheBeatingMoves(clickedPawn, player, isQueen) {
  return [];
}
function attachMoves(avaidableMoves, player) {
  avaidableMoves.forEach((move) => attachMove(move, player));
}

function attachMove({ isQueen, fieldIndex }, player) {
  const pawn = createPawn(player);
  isQueen && pawn.classList.add("queen");
  pawn.classList.add("canMove");

  const fields = document.querySelectorAll(".chessboard .field");
  fields[fieldIndex]?.append(pawn);
}

// TODO 2:
function handleHolderPawnClicked(clickedCanMovePawn, selectedPawn) {
  // check if it is a beat (if between clicked field and selected pawn contain enemy pawn then it is beat)
  // remove selected pawn
  // remove class .canmove for clicked pawn
  // check if promote pawn
}

// ------------------------
rowsNumber.addEventListener("input", changeBoardSize);
colsNumber.addEventListener("input", changeBoardSize);
pawnsNumber.addEventListener("input", changePawnsNumber);

function changeBoardSize() {
  let chessboardRows = getComputedStyle(document.body).getPropertyValue(
    "--rows"
  );
  let chessboardColumns = getComputedStyle(document.body).getPropertyValue(
    "--columns"
  );

  if (this === rowsNumber) {
    chessboardRows = this.valueAsNumber;
    document.body.style.setProperty("--rows", chessboardRows);
  } else if (this === colsNumber) {
    chessboardColumns = this.valueAsNumber;
    document.body.style.setProperty("--columns", chessboardColumns);
  }

  chessboardEl.innerHTML = "";
  createFields(chessboardRows, chessboardColumns);

  setMaxPawnsNumber(chessboardRows, chessboardColumns);
  changePawnsNumberOnChessboard(pawnsNumber.value);
}

function createFields(chessboardRows = 8, chessboardColumns = 8) {
  for (let row = 0; row < chessboardRows; row++) {
    for (let column = 0; column < chessboardColumns; column++) {
      const fieldEl = document.createElement("div");
      fieldEl.classList.add("field");
      colorTheField(fieldEl, row, column);

      chessboardEl.append(fieldEl);
    }
  }
}

function setMaxPawnsNumber(chessboardRows, chessboardColumns) {
  if (chessboardRows % 2 === 1) {
    pawnsNumber.max = Math.floor(
      ((chessboardRows - 1) * chessboardColumns) / 4
    );
  } else {
    pawnsNumber.max = Math.ceil((chessboardRows * chessboardColumns) / 4);
  }
}

function changePawnsNumber() {
  const pawnsNumber = this.valueAsNumber;
  changePawnsNumberOnChessboard(pawnsNumber);
}

function changePawnsNumberOnChessboard(pawnsNumber) {
  const chessboardRows = getComputedStyle(document.body).getPropertyValue(
    "--rows"
  );
  const chessboardColumns = getComputedStyle(document.body).getPropertyValue(
    "--columns"
  );
  const fields = document.querySelectorAll(".chessboard .field");

  let blackPawns = 0;
  for (let row = 0; row < Math.floor(chessboardRows / 2); row++) {
    for (let column = 0; column < chessboardColumns; column++) {
      if ((row + column) % 2 == 0) continue;

      fields[row * chessboardColumns + column].innerHTML = "";
      if (blackPawns < pawnsNumber) {
        const pawn = createPawn("black");
        fields[row * chessboardColumns + column].append(pawn);
        blackPawns++;
      }
    }
  }
  // clear middle row if exist
  if (chessboardRows % 2 == 1) {
    const rowIndex = Math.floor(chessboardRows / 2);
    for (let column = 0; column < chessboardColumns; column++) {
      fields[rowIndex * chessboardColumns + column].innerHTML = "";
    }
  }

  let whitePawns = 0;
  for (let row = chessboardRows - 1; row >= chessboardRows / 2; row--) {
    for (let column = 0; column < chessboardColumns; column++) {
      if ((row + column) % 2 == 0) continue;

      fields[row * chessboardColumns + column].innerHTML = "";
      if (whitePawns < pawnsNumber) {
        const pawn = createPawn("white");
        fields[row * chessboardColumns + column].append(pawn);
        whitePawns++;
      }
    }
  }
}

function createPawn(color) {
  const cylinderEl = document.createElement("div");
  cylinderEl.classList.add("cylinder");
  cylinderEl.classList.add(color);
  return cylinderEl;
}
