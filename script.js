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
  const playerPawn = this.children[0];
  const isCurrentPlayerPawnClicked = playerPawn?.classList.contains(turn);
  const isPossibleMoveFieldClicked = this.classList.contains("canMove");
  // if (clicked on own pawn) OR (clicked on canMove field) then execute rest of the function
  if (!isCurrentPlayerPawnClicked && !isPossibleMoveFieldClicked) return;

  if (isCurrentPlayerPawnClicked) {
    handleCurrentPlayerPawnClick(this);
  } else if (isPossibleMoveFieldClicked) {
    handleHolderPawnClicked(this);
  }
}

function handleCurrentPlayerPawnClick(srcEl) {
  const isSelectPawnClicked = srcEl.classList.contains("fieldSelected");
  if (isSelectPawnClicked) {
    removeAllHolderPawns();
    removeSelection(srcEl);
  } else {
    removeAllPawnSelected();
    addSelection(srcEl);
    addAllPossibleMoves(srcEl);
  }
}

function removeAllHolderPawns() {
  const canMoveElements = document.querySelectorAll(".canMove");
  canMoveElements.forEach((el) => el.remove());
}

function removeSelection(srcEl) {
  srcEl.classList.remove("fieldSelected");
}

function removeAllPawnSelected() {
  const currentPlayerPawns = document.querySelectorAll(".fieldSelected");
  currentPlayerPawns.forEach((pawnEl) =>
    pawnEl.classList.remove("fieldSelected")
  );
}
function addSelection(srcEl) {
  srcEl.classList.add("fieldSelected");
}

// TODO:
function addAllPossibleMoves(scrEl) {}
// TODO:
function handleHolderPawnClicked(srcEl) {
  const fields = document.querySelectorAll(".chessboard .field");
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
