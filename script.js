const block = [
  {
    name: "Z",
    shape: [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
      //   [0, 0],[-y,x]
      //   [0, 1],
      //   [-1, 1],
      //   [-1, 2],
      //   [0, 0],
      //   [-1, -0],[-x,-y]
      //   [-1, -1],
      //   [-2, -1],
      //   [0, 0],[y,-x]
      //   [0, -1],
      //   [1, -1],
      //   [1, -2],
    ],
  },
  {
    name: "S",
    shape: [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
  },
  {
    name: "I",
    shape: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
  },
  {
    name: "L",
    shape: [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 2],
    ],
  },
  {
    name: "J",
    shape: [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
    ],
  },
  {
    name: "T",
    shape: [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 1],
    ],
  },
  {
    name: "O",
    shape: [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
  },
];
const color = ["red", "orange", "yellow", "green", "blue", "cyan", "purple"];

const CELL_WIDTH = 20;
const CELL_HEIGHT = 20;
const FIELD_WIDTH = 13;
const FIELD_HEIGHT = 20;
const FieldArray = [];
const pointerArray = [];
const pointer = { x: 6, y: 3 };
let currentBlock = block[Math.floor(Math.random() * block.length)];
let blockDirectionIndex = 0;
let score = 0;

for (let i = 0; i < FIELD_HEIGHT; i++) {
  FieldArray[i] = [];
  pointerArray[i] = [];
  for (let j = 0; j < FIELD_WIDTH; j++) {
    FieldArray[i][j] = false;
    pointerArray[i][j] = false;
  }
}

const rotate = (coordinate, direction) => {
  const [x, y] = coordinate;
  switch (direction) {
    case 0:
      return [x, y];
    case 1:
      return [y, -x];
    case 2:
      return [-x, -y];
    case 3:
      return [-y, x];
  }
};

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

//포인터 그리기
const drawPointer = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < FIELD_HEIGHT; i++) {
    pointerArray[i].fill(-1);
  }
  currentBlock.shape
    .map((shape) => rotate(shape, blockDirectionIndex))
    .forEach((element) => {
      pointerArray[pointer.y + element[1]][pointer.x + element[0]] =
        block.findIndex((block) => block.name === currentBlock.name) + 1;
    });
  for (let i = 0; i < FIELD_HEIGHT; i++) {
    for (let j = 0; j < FIELD_WIDTH; j++) {
      if (pointerArray[i][j] > 0) {
        ctx.fillStyle = color[pointerArray[i][j] - 1];
        ctx.fillRect(j * CELL_WIDTH, i * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
        ctx.strokeStyle = "black";
        ctx.strokeRect(j * CELL_WIDTH, i * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
      }
    }
  }
};
//필드 그리기
const drawField = () => {
  for (let i = 0; i < FIELD_HEIGHT; i++) {
    for (let j = 0; j < FIELD_WIDTH; j++) {
      if (FieldArray[i][j] > 0) {
        ctx.fillStyle = color[FieldArray[i][j] - 1];
        ctx.fillRect(j * CELL_WIDTH, i * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
        ctx.strokeStyle = "black";
        ctx.strokeRect(j * CELL_WIDTH, i * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
      }
    }
  }
};

const drawScene = () => {
  drawPointer();
  drawField();
};

const upButton = document.getElementById("up");
const upButtonHandler = () => {
  blockDirectionIndex = (blockDirectionIndex + 1) % 4;
  console.log(blockDirectionIndex);
  drawScene();
  checkCollision();
};
upButton.addEventListener("click", upButtonHandler);
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    upButtonHandler();
  }
});

const downButton = document.getElementById("down");
const downButtonHandler = () => {
  if (pointer.y < FIELD_HEIGHT - 1) {
    pointer.y += 1;
  }
  drawScene();
  checkCollision();
};
downButton.addEventListener("click", () => {
  downButtonHandler();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    downButtonHandler();
  }
});

const leftButton = document.getElementById("left");
const leftButtonHandler = () => {
  if (pointer.x > 0 && checkMovable("left")) {
    pointer.x -= 1;
  }
  drawScene();
  checkCollision();
};
leftButton.addEventListener("click", () => {
  leftButtonHandler();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    leftButtonHandler();
  }
});

const rightButton = document.getElementById("right");
const rightButtonHandler = () => {
  if (pointer.x < FIELD_WIDTH - 1 && checkMovable("right")) {
    pointer.x += 1;
  }
  drawScene();
  checkCollision();
};
rightButton.addEventListener("click", () => {
  rightButtonHandler();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    rightButtonHandler();
  }
});

const saveField = () => {
  for (let i = 0; i < FIELD_HEIGHT; i++) {
    for (let j = 0; j < FIELD_WIDTH; j++) {
      if (pointerArray[i][j] > 0) {
        FieldArray[i][j] = block.findIndex((block) => block.name === currentBlock.name) + 1;
      }
    }
  }
  console.log(FieldArray);
  drawField();
};

const pointerReset = () => {
  pointer.x = 6;
  pointer.y = 3;
  currentBlock = block[Math.floor(Math.random() * block.length)];
  drawPointer();
};

const checkCollision = () => {
  for (let i = 0; i < FIELD_HEIGHT; i++) {
    for (let j = 0; j < FIELD_WIDTH; j++) {
      //바닥에 닿았을경우
      if (pointerArray[FIELD_HEIGHT - 1][j] > 0) {
        console.log("바닥에 닿음");
        saveField();
        pointerReset();
        drawScene();
        return;
      }
      //스테이지 바닥에 닿았을경우
      if (FieldArray[i][j] > 0 && pointerArray[i - 1][j] > 0) {
        console.log("스테이지에 닿음");
        saveField();
        pointerReset();
        drawScene();
        return;
      }
    }
  }
};

const checkMovable = (direction) => {
  for (let i = 0; i < FIELD_HEIGHT; i++) {
    for (let j = 0; j < FIELD_WIDTH; j++) {
      if (FieldArray[i][j - 1] > 0 && pointerArray[i][j] > 0 && direction === "left") {
        return false;
      }
      if (FieldArray[i][j + 1] > 0 && pointerArray[i][j] > 0 && direction === "right") {
        return false;
      }
      if (pointerArray[i][j] > 0 && direction === "right" && j === FIELD_WIDTH - 1) {
        return false;
      }
      if (pointerArray[i][j] > 0 && direction === "left" && j === FIELD_WIDTH + 1) {
        return false;
      }
    }
  }
  return true;
};

drawPointer();
