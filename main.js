const gameSet = document.querySelector(".gameSet");
const gameBoard = document.querySelector(".gameBoard");
const level = document.querySelector(".level");
const level_btn = document.querySelectorAll(".level button");
const setting = document.querySelector(".setting");
const gameStart = document.querySelector(".game-start");

function init() {
  // 게임 난이도 선택 (초급, 중급, 고급, 최고급, 맞춤형)
  level_btn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target_id = e.target.id;
      switch (target_id) {
        case "level1":
          setGame(9, 9, 10);
          break;
        case "level2":
          setGame(16, 16, 40);
          break;
        case "level3":
          setGame(30, 16, 99);
          break;
        case "level4":
          setGame(30, 24, 160);
          break;
        case "levelSet":
          level.style.display = "none";
          setting.classList.add("open");
          break;
      }
    });
  });

  // 게임 시작 버튼 (맞춤형)
  gameStart.addEventListener("click", () => {
    const row = Number(document.getElementById("row").value),
      col = Number(document.getElementById("col").value),
      mineNum = Number(document.getElementById("mineNum").value);

    setGame(row, col, mineNum);
  });
}

function setGame(row, col, mineNum) {
  gameSet.style.display = "none";

  // 지뢰 배열 생성
  const mineArr = setMineArr(mineNum, row * col);
  console.log(mineArr);

  // Board 생성
  setBoard(row, col);
  //   setMines(mineArr);
}

function setMineArr(mineNum, mineRange) {
  let mineArr = [];

  for (let i = 0; i < mineNum; i++) {
    const random = Math.floor(Math.random() * mineRange);
    if (!mineArr.includes(random)) {
      mineArr.push(random);
    } else {
      i--;
    }
  }

  return mineArr;
}

function setBoard(row, col) {
  let table = "<table>";

  for (let i = 0; i < row; i++) {
    table += "<tr>";
    for (let j = 0; j < col; j++) {
      table += "<td></td>";
    }
    table += "</tr>";
  }

  table += "</table>";

  gameBoard.innerHTML = table;
}

init();
