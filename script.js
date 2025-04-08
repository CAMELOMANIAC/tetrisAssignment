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
      [2, 0],
      [1, 0],
      [1, 1],
      [0, 1],
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
const rotateBlockArray = [];
const pointer = { x: 6, y: 3 };
const randomBlockIndexGenerator = () => Math.floor(Math.random() * block.length);
let hasFalling = false;

let currentBlock = block[randomBlockIndexGenerator()];
let nextBlock = block[randomBlockIndexGenerator()];
let blockDirectionIndex = 0;
let score = 0;

for (let i = 0; i < FIELD_HEIGHT; i++) {
  FieldArray[i] = [];
  pointerArray[i] = [];
  rotateBlockArray[i] = [];
  for (let j = 0; j < FIELD_WIDTH; j++) {
    FieldArray[i][j] = -1;
    pointerArray[i][j] = -1;
    rotateBlockArray[i][j] = -1;
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
//다음 블럭 그리기
const drawNextBlock = () => {
  ctx.fillStyle = "white";
  ctx.fillRect(10, 10, 100, 100);
  ctx.strokeStyle = "black";
  ctx.strokeRect(10, 10, 100, 100);
  nextBlock.shape.forEach((element) => {
    ctx.fillStyle = color[block.findIndex((block) => block.name === nextBlock.name)];
    ctx.fillRect(20 + element[0] * CELL_WIDTH, 20 + element[1] * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
    ctx.strokeStyle = "black";
    ctx.strokeRect(20 + element[0] * CELL_WIDTH, 20 + element[1] * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
  });
};
//점수 그리기
const drawScore = () => {
  ctx.fillStyle = "white";
  ctx.fillRect(140, 10, 110, 30);
  ctx.strokeStyle = "black";
  ctx.strokeRect(140, 10, 110, 30);
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText(`Score : ${score}`, 150, 30);
};
//회전 예상 블럭 위치 그리기(테스트용)
const drawRotateBlock = () => {
  for (let i = 0; i < FIELD_HEIGHT; i++) {
    rotateBlockArray[i].fill(-1);
  }
  currentBlock.shape
    .map((shape) => rotate(shape, (blockDirectionIndex + 1) % 4))
    .forEach((element) => {
      rotateBlockArray[pointer.y + element[1]][pointer.x + element[0]] =
        block.findIndex((block) => block.name === currentBlock.name) + 1;
    });
  for (let i = 0; i < FIELD_HEIGHT; i++) {
    for (let j = 0; j < FIELD_WIDTH; j++) {
      if (rotateBlockArray[i][j] > 0) {
        ctx.fillStyle = "white";
        ctx.fillRect(j * CELL_WIDTH, i * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
        ctx.strokeStyle = "black";
        ctx.strokeRect(j * CELL_WIDTH, i * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
      }
    }
  }
};

const drawStage = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //drawRotateBlock();
  drawPointer();
  drawField();
  drawNextBlock();
  drawScore();
};

const upButton = document.getElementById("up");
const upButtonHandler = () => {
  const isRotatable = checkRotatable();
  if (isRotatable) {
    blockDirectionIndex = (blockDirectionIndex + 1) % 4;
    drawStage();
    checkCollision();
  }
};
upButton.addEventListener("click", upButtonHandler);
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    upButtonHandler();
  }
});
const falling = () => {
  if (pointer.y < FIELD_HEIGHT - 1) {
    fallingTimer = requestAnimationFrame(falling);
    pointer.y += 1;
    hasFalling = true;
    drawStage();
    checkCollision();
  }
};
let fallingTimer;
const downButtonHandler = () => {
  fallingTimer = requestAnimationFrame(falling);
};
const downButton = document.getElementById("down");
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
  if (pointer.x > 0 && checkMovable("left") && !hasFalling) {
    pointer.x -= 1;
  }
  drawStage();
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
  if (pointer.x < FIELD_WIDTH - 1 && checkMovable("right") && !hasFalling) {
    pointer.x += 1;
  }
  drawStage();
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
  drawField();
};

const pointerReset = () => {
  pointer.x = 6;
  pointer.y = 3;
  currentBlock = nextBlock;
  nextBlock = block[randomBlockIndexGenerator()];
  drawPointer();
};

const removeLine = () => {
  for (let i = 0; i < FIELD_HEIGHT; i++) {
    let count = 0;
    for (let j = 0; j < FIELD_WIDTH; j++) {
      if (FieldArray[i][j] > 0) {
        count += 1;
      }
      if (count === FIELD_WIDTH) {
        FieldArray.pop();
        FieldArray.unshift([...Array(FIELD_WIDTH)].map(() => -1));
        score += 1000;
      }
    }
  }
};

const checkCollision = () => {
  for (let i = 0; i < FIELD_HEIGHT; i++) {
    for (let j = 0; j < FIELD_WIDTH; j++) {
      //바닥에 닿았을경우
      if (pointerArray[FIELD_HEIGHT - 1][j] > 0) {
        saveField();
        removeLine();
        pointerReset();
        drawStage();
        hasFalling = false;
        cancelAnimationFrame(fallingTimer);
        return;
      }
      //스테이지 바닥에 닿았을경우
      if (FieldArray[i][j] > 0 && pointerArray[i - 1][j] > 0) {
        saveField();
        removeLine();
        pointerReset();
        drawStage();
        hasFalling = false;
        cancelAnimationFrame(fallingTimer);
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
      if (pointerArray[i][j] > 0 && direction === "left" && j === 0) {
        return false;
      }
    }
  }
  return true;
};

const checkRotatable = () => {
  for (let i = 0; i < FIELD_HEIGHT; i++) {
    rotateBlockArray[i].fill(-1);
  }
  currentBlock.shape
    .map((shape) => rotate(shape, (blockDirectionIndex + 1) % 4))
    .forEach((element) => {
      rotateBlockArray[pointer.y + element[1]][pointer.x + element[0]] =
        block.findIndex((block) => block.name === currentBlock.name) + 1;
    });
  let count = 0;
  for (let i = 0; i < FIELD_HEIGHT; i++) {
    for (let j = 0; j < FIELD_WIDTH; j++) {
      //예상위치가 필드 블럭에 닿는지 체크
      if (rotateBlockArray[i][j] > 0 && FieldArray[i][j] > 0) {
        return false;
      }
      //예상위치가 스테이지 좌,우측에 닿는지 체크
      if ((rotateBlockArray[i][j] > 0 && j > FIELD_WIDTH + 1) || j < 0) {
        return false;
      }
      //블럭 예상위치에 자리가 있는지 체크
      if (rotateBlockArray[i][j] > 0) {
        count += 1;
      }
    }
  }
  if (count < 4) {
    count = 0;
    return false;
  }
  return true;
};

drawStage();
