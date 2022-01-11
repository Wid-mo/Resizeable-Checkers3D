const chessboardEl = document.getElementsByClassName("chessboard")[0];
const rowsNumber = document.getElementById("noOfRows");
const colsNumber = document.getElementById("noOfColumns");

setup();

function setup() {
  colorTheFields(8, 8);
}

function colorTheFields(rows = 8, columns = 8) {
  const fields = document.querySelectorAll(".chessboard .field");
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const index = row * columns + column;
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

function changeBoardSize(e) {
  let rows = getComputedStyle(document.body).getPropertyValue("--rows");
  let columns = getComputedStyle(document.body).getPropertyValue("--columns");

  if (this === rowsNumber) {
    rows = e.target.valueAsNumber;
    document.body.style.setProperty("--rows", rows);
  } else if (this === colsNumber) {
    columns = e.target.valueAsNumber;
    document.body.style.setProperty("--columns", columns);
  }

  chessboardEl.innerHTML = "";
  createFields(rows, columns);
}

function createFields(rows = 8, columns = 8) {
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const fieldEl = document.createElement("div");
      fieldEl.classList.add("field");
      colorTheField(fieldEl, row, column);

      chessboardEl.append(fieldEl);
    }
  }
}
