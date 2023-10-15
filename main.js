"use strict";

const gameSet = document.querySelector(".gameSet");
const gameBoard = document.querySelector(".gameBoard");
const level = document.querySelector(".level");
const level_btn = document.querySelectorAll(".level button");
const setting = document.querySelector(".setting");
const gameStart = document.querySelector(".game-start");

const tdArr = document.getElementsByTagName("td");

const colors = [
  "#388e3c",
  "#0288d1",
  "#00796b",
  "#303f9f",
  "#512da8",
  "#c2185b",
  "#d32f2f",
  "#f57c00",
];

// 우클릭 방지
window.addEventListener("contextmenu", (e) => e.preventDefault());

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

  const mineArr = setMineArr(mineNum, row * col); // 지뢰 배열 생성

  setBoard(row, col); // Board 생성
  setMines(mineArr); // Board에 지뢰 세팅

  // 버튼 클릭 이벤트
  for (let i = 0; i < tdArr.length; i++) {
    tdArr[i].addEventListener("click", () => {
      clickEvent(i, row, col);
    });
    tdArr[i].addEventListener("auxclick", () => {
      rightClick(i);
    });
  }
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

function setMines(mineArr) {
  for (let i = 0; i < tdArr.length; i++) {
    if (mineArr.includes(i)) {
      tdArr[i].classList.add("mine");
    }
  }
}

function clickEvent(idx, row, col) {
  if (tdArr[idx].dataset.isOpen) return;

  const outArr = outsideArr(idx, row, col); // 주변 타일 배열

  if (tdArr[idx].classList.contains("mine")) {
    alert("GAME OVER!!!");
    // 모든 지뢰 공개
    for (let i = 0; i < tdArr.length; i++) {
      if (tdArr[i].classList.contains("mine")) {
        tdArr[i].innerText = "✸";
        tdArr[i].style.backgroundColor = "#f44336";
        tdArr[i].dataset.isOpen = "true";
      }
    }
  } else {
    tdArr[idx].style.backgroundColor = "#f2f2f2";
    const mineCount = countOutside(outArr); // 주변 타일 지뢰 개수
    if (mineCount === 0) {
      tdArr[idx].dataset.isOpen = "true";
      for (let i = 0; i < outArr.length; i++) {
        if (!tdArr[outArr[i]].dataset.isOpen) {
          clickEvent(outArr[i], row, col);
        }
      }
    } else {
      // 주변에 지뢰가 있으면 개수 표시
      tdArr[idx].dataset.isOpen = "true";
      tdArr[idx].style.color = colors[mineCount - 1];
      tdArr[idx].innerText = mineCount;
    }
  }
}

function countOutside(outArr) {
  // 주변 타일 지뢰 개수
  let mineCount = 0;

  for (let i = 0; i < outArr.length; i++) {
    if (tdArr[outArr[i]].classList.contains("mine")) {
      mineCount++;
    }
  }

  return mineCount;
}

function outsideArr(num, row, col) {
  // 모서리
  if (num === 0) return [num + 1, num + col, num + col + 1];
  if (num === col - 1) return [num - 1, num + col - 1, num + col];
  if (num === col * (row - 1)) return [num - col, num - col + 1, num + 1];
  if (num === col * row - 1) return [num - col - 1, num - col, num - 1];
  // 위아래 테두리
  if (num > 0 && num < col - 1)
    return [num - 1, num + 1, num + col - 1, num + col, num + col + 1];
  if (num > col * (row - 1) && num < col * row - 1)
    return [num - col - 1, num - col, num - col + 1, num - 1, num + 1];
  // 왼오 테두리
  if (num % col === 0)
    return [num - col, num - col + 1, num + 1, num + col, num + col + 1];
  if (num % col === col - 1)
    return [num - col - 1, num - col, num - 1, num + col - 1, num + col];
  // 가운데
  return [
    num - col - 1,
    num - col,
    num - col + 1,
    num - 1,
    num + 1,
    num + col - 1,
    num + col,
    num + col + 1,
  ];
}

function rightClick(idx) {
  if (tdArr[idx].dataset.isOpen) return;

  if (tdArr[idx].classList.contains("flag")) {
    tdArr[idx].classList.remove("flag");
    tdArr[idx].classList.add("qmark");
    tdArr[idx].innerText = "❓";
  } else if (tdArr[idx].classList.contains("qmark")) {
    tdArr[idx].classList.remove("qmark");
    tdArr[idx].innerText = "";
    tdArr[idx].style.backgroundColor = "#fafafa";
  } else {
    tdArr[idx].classList.add("flag");
    tdArr[idx].innerText = "🚩";
    tdArr[idx].style.backgroundColor = "#ede7f6";
  }
}

init();
