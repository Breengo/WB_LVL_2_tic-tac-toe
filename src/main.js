import "./style.css";

let move = "blue";
let mode = "duo";
let complexity = "easy";

let table = [0, 0, 0, 0, 0, 0, 0, 0, 0];

const winMessage = document.querySelector(".win_message");
const buttons = winMessage.querySelectorAll("button");
const h2 = document.querySelector("h2");
const p = winMessage.querySelector("p");

const lastMatch = localStorage.getItem("table");

const clearTable = () => {
  table = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  move = "blue";
  h2.style.color = "#4f4de0";
  h2.innerText = "Ход синего";
  winMessage.style.display = "none";
  document.querySelectorAll(".table_block").forEach((block, index) => {
    block.innerHTML = "";
  });
};

if (lastMatch) {
  clearTable();
  table = JSON.parse(lastMatch);
  move = localStorage.getItem("move");
  mode = localStorage.getItem("mode");
  complexity = localStorage.getItem("complexity");
  if (move === "blue") {
    h2.style.color = "#4f4de0";
    h2.innerText = "Ход синего";
  } else {
    h2.style.color = "#e04d4d";
    h2.innerText = "Ход красного";
  }
  document.querySelectorAll(".table_block").forEach((block, index) => {
    if (table[index] === 1) block.innerHTML = "<div class='o'></div>";
    else if (table[index] === 2) block.innerHTML = "<div class='x'></div>";
  });
}

buttons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    if (index === 1) {
      mode = "solo";
      p.innerText = "Выберите сложность";
      buttons[0].style.display = "none";
      buttons[1].style.display = "none";
      buttons[2].style.display = "block";
      buttons[3].style.display = "block";
    } else if (index === 2) {
      complexity = "easy";
      clearTable();
    } else if (index === 3) {
      complexity = "hard";
      clearTable();
    } else {
      mode = "duo";
      clearTable();
    }
  });
});

const showButtons = () => {
  buttons[0].style.display = "block";
  buttons[1].style.display = "block";
  buttons[2].style.display = "none";
  buttons[3].style.display = "none";
};

const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const checkWin = (player) => {
  let isWinned = false;
  winCombinations.forEach((combination) => {
    if (combination.filter((block) => table[block] === player).length === 3)
      isWinned = true;
  });
  return isWinned;
};

const hardStrat = () => {
  let freeBlock = 0;
  let reserve = -1;
  let win = 0;
  winCombinations.forEach((combination) => {
    let winCounter = 0;
    let looseCounter = 0;
    for (let i = 0; i < combination.length; i++) {
      if (table[combination[i]] === 2) {
        winCounter++;
      } else if (table[combination[i]] === 1) {
        looseCounter++;
      } else freeBlock = combination[i];
      if (winCounter === 2) {
        win = freeBlock;
      }
      if (looseCounter === 2) {
        reserve = freeBlock;
      }
    }
  });
  if (win) return win;
  return reserve;
};

const makeMove = (block, index) => {
  table[index] = move === "red" ? 2 : 1;
  h2.style.color = move === "red" ? "#4f4de0" : "#e04d4d";
  h2.innerText = `Ход ${move === "red" ? "синего" : "красного"}`;
  block.innerHTML = `<div class=${move === "red" ? "x" : "o"}></div>`;
  if (checkWin(move === "red" ? 2 : 1)) {
    localStorage.removeItem("table");
    winMessage.style.display = "flex";
    p.innerText = `Победил ${move === "red" ? "красный" : "синий"}`;
    p.style.color = move === "red" ? "#e04d4d" : "#4f4de0";
    showButtons();
    move = "blue";
  } else if (table.filter((item) => item !== 0).length === 9) {
    localStorage.removeItem("table");
    winMessage.style.display = "flex";
    p.innerText = "Ничья";
    p.style.color = "#242424";
    showButtons();
    move = "blue";
  } else {
    if (move === "red") move = "blue";
    else move = "red";
    localStorage.setItem("table", JSON.stringify(table));
    localStorage.setItem("move", move);
    localStorage.setItem("mode", mode);
    localStorage.setItem("complexity", complexity);
  }
};

const blocks = document.querySelectorAll(".table_block");

blocks.forEach((block, index) => {
  block.addEventListener("click", () => {
    if (block.innerHTML === "") {
      makeMove(block, index);
      const occupiedSlots = table.filter((item) => item !== 0).length;
      if (mode === "solo" && complexity === "easy" && occupiedSlots !== 9) {
        let random = Math.round(Math.random() * 10) % 9;
        while (table[random] !== 0) {
          random = Math.round(Math.random() * 10) % 9;
        }
        makeMove(blocks[random], random);
      } else if (mode === "solo" && complexity === "hard") {
        let botMove = 0;
        const stratMove = hardStrat();
        if (stratMove === -1) {
          let random = Math.round(Math.random() * 10) % 9;
          while (table[random] !== 0) {
            random = Math.round(Math.random() * 10) % 9;
          }
          botMove = random;
        } else {
          botMove = hardStrat();
        }
        makeMove(blocks[botMove], botMove);
      }
    }
  });
});
