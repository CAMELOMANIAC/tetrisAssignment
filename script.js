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
const CELL_WIDTH = 20;
const CELL_HEIGHT = 20;
const STAGE_WIDTH = 13;
const STAGE_HEIGHT = 20;
const stageArray = [];
const pointerArray = [];
const pointer = { x: 6, y: 0 };
const currentBlock = block[0];
let blockDirectionIndex = 0;
const score = 0;

for (let i = 0; i < STAGE_HEIGHT; i++) {
  stageArray[i] = [];
  pointerArray[i] = [];
  for (let j = 0; j < STAGE_WIDTH; j++) {
    stageArray[i][j] = 0;
    pointerArray[i][j] = 0;
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

//포인터
const drawPointer = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < STAGE_HEIGHT; i++) {
    pointerArray[i].fill(0);
  }
  ctx.fillRect(pointer.x * CELL_WIDTH, pointer.y * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT); //커서 위치 확인용
  currentBlock.shape
    .map((shape) => rotate(shape, blockDirectionIndex))
    .forEach((element) => {
      pointerArray[pointer.y + element[1]][pointer.x + element[0]] = 1;
    });
  for (let i = 0; i < STAGE_HEIGHT; i++) {
    for (let j = 0; j < STAGE_WIDTH; j++) {
      if (pointerArray[i][j] > 0) {
        ctx.strokeRect(j * CELL_WIDTH, i * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
      }
    }
  }
};
//스테이지
const drawStage = () => {
  for (let i = 0; i < STAGE_HEIGHT; i++) {
    for (let j = 0; j < STAGE_WIDTH; j++) {
      if (stageArray[i][j] > 0) {
        ctx.strokeRect(j * CELL_WIDTH, i * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
      }
    }
  }
};

const drawScene = () => {
  drawPointer();
  drawStage();
};

const up = document.getElementById("up");
up.addEventListener("click", () => {
  blockDirectionIndex = (blockDirectionIndex + 1) % 4;
  console.log(blockDirectionIndex);
  drawScene();
  checkCollision();
});
const down = document.getElementById("down");
down.addEventListener("click", () => {
  if (pointer.y < STAGE_HEIGHT - 1) {
    pointer.y += 1;
  }
  drawScene();
  checkCollision();
});
const left = document.getElementById("left");
left.addEventListener("click", () => {
  if (pointer.x > 0 && checkMovable("left")) {
    pointer.x -= 1;
  }
  drawScene();
  checkCollision();
});
const right = document.getElementById("right");
right.addEventListener("click", () => {
  if (pointer.x < STAGE_WIDTH - 1 && checkMovable("right")) {
    pointer.x += 1;
  }
  drawScene();
  checkCollision();
});

const saveStage = () => {
  for (let i = 0; i < STAGE_HEIGHT; i++) {
    for (let j = 0; j < STAGE_WIDTH; j++) {
      if (pointerArray[i][j] > 0) {
        stageArray[i][j] = 1;
      }
    }
  }
  console.log(stageArray);
  drawStage();
};

const pointerReset = () => {
  pointer.x = 6;
  pointer.y = 0;
  drawPointer();
};

const checkCollision = () => {
  for (let i = 0; i < STAGE_HEIGHT; i++) {
    for (let j = 0; j < STAGE_WIDTH; j++) {
      //바닥에 닿았을경우
      if (pointerArray[STAGE_HEIGHT - 1][j] > 0) {
        console.log("바닥에 닿음");
        saveStage();
        pointerReset();
        drawScene();
        return;
      }
      //스테이지 바닥에 닿았을경우
      if (stageArray[i][j] > 0 && pointerArray[i - 1][j] > 0) {
        console.log("스테이지에 닿음");
        saveStage();
        pointerReset();
        drawScene();
        return;
      }
    }
  }
};

const checkMovable = (direction) => {
  for (let i = 0; i < STAGE_HEIGHT; i++) {
    for (let j = 0; j < STAGE_WIDTH; j++) {
      if (stageArray[i][j - 1] > 0 && pointerArray[i][j] > 0 && direction === "left") {
        return false;
      }
      if (stageArray[i][j + 1] > 0 && pointerArray[i][j] > 0 && direction === "right") {
        return false;
      }
      if (pointerArray[i][j] > 0 && direction === "right" && j === STAGE_WIDTH - 1) {
        return false;
      }
      if (pointerArray[i][j] > 0 && direction === "left" && j === STAGE_WIDTH + 1) {
        return false;
      }
    }
  }
  return true;
};

drawPointer();
