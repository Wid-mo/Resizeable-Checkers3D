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

/** toolkit functions */

function isFirstRow(fieldIndex) {
  const chessboardColumns = getComputedStyle(document.body).getPropertyValue(
    "--columns"
  );

  return fieldIndex < chessboardColumns;
}
function isLastRow(fieldIndex) {
  const chessboardRows = getComputedStyle(document.body).getPropertyValue(
    "--rows"
  );
  const chessboardColumns = getComputedStyle(document.body).getPropertyValue(
    "--columns"
  );

  return fieldIndex >= chessboardColumns * (chessboardRows - 1);
}

/** initialize */

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
  const selectedField = document.querySelector(".chessboard .fieldSelected");
  const isCurrentPlayerPawnClicked = clickedPawn?.classList.contains(turn);
  const isPossibleMoveFieldClicked = clickedPawn?.classList.contains("canMove");
  // if (clicked on current player pawn) OR (clicked on canMove field) then execute rest of the function
  if (!isCurrentPlayerPawnClicked && !isPossibleMoveFieldClicked) return;

  if (isCurrentPlayerPawnClicked && !isPossibleMoveFieldClicked) {
    handleCurrentPlayerPawnClick(this);
  } else if (isPossibleMoveFieldClicked) {
    handleHolderPawnClicked(this, selectedField);
  }
}

function handleCurrentPlayerPawnClick(currentPlayerFieldClicked) {
  const isSelectPawnClicked =
    currentPlayerFieldClicked.classList.contains("fieldSelected");
  deselectAll();

  if (!isSelectPawnClicked) {
    addSelection(currentPlayerFieldClicked);
    addAllPossibleMoves(currentPlayerFieldClicked);
  }
}

function deselectAll() {
  removeAllHolderPawns();
  removeAllPawnSelected();
}

function removeAllHolderPawns() {
  const canMoveElements = document.querySelectorAll(".canMove");
  canMoveElements.forEach((el) => el.remove());
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

function addAllPossibleMoves(currentPlayerFieldClicked) {
  const fields = document.querySelectorAll(".chessboard .field");
  const fieldIndex = Array.from(fields).findIndex(
    (field) => field === currentPlayerFieldClicked
  );
  const clickedPawn = currentPlayerFieldClicked.children[0];
  
  const isQueen = clickedPawn.classList.contains("queen");

  const selectedPawn = {
    x: 1,
    y: 1,
    color: turn,
    isQueen: isQueen
  }
  // avaidableMoves contain array of objects TODO
  const avaidableMoves = [
    ...getNormalMoves(fieldIndex, turn, isQueen),
    ...getTheBeatingMoves(fieldIndex, turn, isQueen),
  ];
  // attach moves pass avaidable moves only TODO
  attachMoves(avaidableMoves, turn);
}

function getNormalMoves(fieldIndex, player, isQueen) {
  // convert it to x, y coordinates
  const boardRows = +getComputedStyle(document.body).getPropertyValue("--rows");
  const boardColumns = +getComputedStyle(document.body).getPropertyValue(
    "--columns"
  );
  const toCartesianCoordinates = (index) => ({
    x: index % boardColumns,
    y: Math.floor(index / boardColumns),
  });
  const { x, y } = toCartesianCoordinates(fieldIndex);
  const shifts = getShifts(player, isQueen);

  // const add = (vector) =>

  // create holder pawns with x and y properties
  let holderPawnsPos = shifts.map(({ dx, dy }) => ({ x: x + dx, y: y - dy }));

  // filter positions outsite the board
  const isInsideBoard = ({ x, y }) =>
    x >= 0 && x < boardColumns && y >= 0 && y < boardColumns;
  holderPawnsPos = holderPawnsPos.filter(isInsideBoard);

  // convert positions array to fields indexes.
  const toFieldIndex = ({ x, y }) => y * boardColumns + x;
  let fieldIndexes = holderPawnsPos.map(toFieldIndex);

  // filter occupy fields
  const fields = document.querySelectorAll(".chessboard .field");
  const containsCyllinderClass = (index) =>
    !fields[index].children[0]?.classList.contains("cylinder");
  fieldIndexes = fieldIndexes.filter(containsCyllinderClass);

  // promote pawn if next position is in promote line
  const isOnPromoteLine = (player) => (fieldIndex) =>
    isOnPromotedLine(fieldIndex, player);
  const pawnIsPromoted = fieldIndexes.some(isOnPromoteLine(player));
  isQueen = pawnIsPromoted ? true : isQueen;

  return fieldIndexes.map((fieldIndex) => ({ fieldIndex, isQueen }));
}

function getShifts(player, isQueen) {
  const whitePawnShifts = [
    { dx: -1, dy: 1 },
    { dx: 1, dy: 1 },
  ];
  const blackPawnShifts = [
    { dx: -1, dy: -1 },
    { dx: 1, dy: -1 },
  ];
  if (player === PLAYERS.WHITE && !isQueen) return whitePawnShifts;
  if (player === PLAYERS.BLACK && !isQueen) return blackPawnShifts;

  return whitePawnShifts.concat(blackPawnShifts);
}

function isOnPromotedLine(fieldIndex, player) {
  return (
    (isFirstRow(fieldIndex) && player === PLAYERS.WHITE) ||
    (isLastRow(fieldIndex) && player === PLAYERS.BLACK)
  );
}

// TODO 1b
function getTheBeatingMoves(fieldIndex, player, isQueen) {
  // // convert it to x, y coordinates
  // const boardRows = +getComputedStyle(document.body).getPropertyValue("--rows");
  // const boardColumns = +getComputedStyle(document.body).getPropertyValue(
  //   "--columns"
  // );
  // const toCartesianCoordinates = (index) => ({
  //   x: index % boardColumns,
  //   y: Math.floor(index / boardColumns),
  // });
  // const { x, y } = toCartesianCoordinates(fieldIndex);
  // const shifts = getShifts(player, isQueen);

  // // create holder pawns with x and y properties
  // let holderPawnsPos = shifts.map(({ dx, dy }) => ({ x: x + dx, y: y - dy }));

  // // filter positions outsite the board
  // const isInsideBoard = ({ x, y }) =>
  //   x >= 0 && x < boardColumns && y >= 0 && y < boardColumns;
  // holderPawnsPos = holderPawnsPos.filter(isInsideBoard);

  // // convert positions array to fields indexes.
  // const toFieldIndex = ({ x, y }) => y * boardColumns + x;
  // let fieldIndexes = holderPawnsPos.map(toFieldIndex);

  // // filter occupy fields
  // const fields = document.querySelectorAll(".chessboard .field");
  // const containsCyllinderClass = (index) =>
  //   !fields[index].children[0]?.classList.contains("cylinder");
  // fieldIndexes = fieldIndexes.filter(containsCyllinderClass);

  // // promote pawn if next position is in promote line
  // const isOnPromoteLine = (player) => (fieldIndex) =>
  //   isOnPromotedLine(fieldIndex, player);
  // const pawnIsPromoted = fieldIndexes.some(isOnPromoteLine(player));
  // isQueen = pawnIsPromoted ? true : isQueen;

  // return fieldIndexes.map((fieldIndex) => ({ fieldIndex, isQueen }));
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

function handleHolderPawnClicked(clickedCanMoveField, selectedField) {
  // check if it is a beat (if between clicked field and selected pawn contain enemy pawn) then remove beated pawn
  const field1 = toCartesianCoordinates(clickedCanMoveField);
  const field2 = toCartesianCoordinates(selectedField);
  const rowsDifference = Math.abs(field1.y - field2.y);
  const isBeat = rowsDifference > 1;
  if (isBeat) {
    const fields = document.querySelectorAll(".chessboard .field");
    const boardColumns = +getComputedStyle(document.body).getPropertyValue(
      "--columns"
    );
    const toFieldIndex = ({ x, y }) => y * boardColumns + x;
    const beatedPawnCartesian = {
      x: (field1.x + field2.x) / 2,
      y: (field1.y + field2.y) / 2,
    };
    const beatedPawnIndex = toFieldIndex(beatedPawnCartesian);
    fields[beatedPawnIndex].innerHTML = "";
  }

  // remove selected pawn
  selectedField.innerHTML = "";

  // remove class .canmove for clicked pawn
  clickedCanMoveField.children[0].classList.remove("canMove");

  removeAllHolderPawns();
  removeAllPawnSelected();

  turn = turn === PLAYERS.WHITE ? PLAYERS.BLACK : PLAYERS.WHITE;
}

function toCartesianCoordinates(field) {
  const fields = document.querySelectorAll(".chessboard .field");
  const fieldIndex = Object.values(fields).findIndex(
    (fieldEl) => fieldEl === field
  );
  const boardColumns = +getComputedStyle(document.body).getPropertyValue(
    "--columns"
  );
  return {
    x: fieldIndex % boardColumns,
    y: Math.floor(fieldIndex / boardColumns),
  };
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
