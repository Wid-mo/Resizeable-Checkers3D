const chessboardEl = document.getElementsByClassName("chessboard")[0];
const rowsNumber = document.getElementById("noOfRows");
const colsNumber = document.getElementById("noOfColumns");
const pawnsNumber = document.getElementById("noOfPawns");

setup();

function setup() {
  colorTheFields(8, 8);
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

// ------------------------
rowsNumber.addEventListener("input", changeBoardSize);
colsNumber.addEventListener("input", changeBoardSize);
pawnsNumber.addEventListener("input", changePawnsNumber);

function changeBoardSize(e) {
  let chessboardRows = getComputedStyle(document.body).getPropertyValue(
    "--rows"
  );
  let chessboardColumns = getComputedStyle(document.body).getPropertyValue(
    "--columns"
  );

  if (this === rowsNumber) {
    chessboardRows = e.target.valueAsNumber;
    document.body.style.setProperty("--rows", chessboardRows);
  } else if (this === colsNumber) {
    chessboardColumns = e.target.valueAsNumber;
    document.body.style.setProperty("--columns", chessboardColumns);
  }

  chessboardEl.innerHTML = "";
  createFields(chessboardRows, chessboardColumns);

  setMaxPawnsNumber(chessboardRows, chessboardColumns);
  changePawnsNumberOnChessboard(pawnsNumber.value)
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

function changePawnsNumber(e) {
  const pawnsNumber = e.target.valueAsNumber;
  changePawnsNumberOnChessboard(pawnsNumber)
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
