const CELL_SIZE = 20;

export class CellRenderer {
  drawBlock(cellArray) {
    cellArray.forEach((column, columnIndex) => {
      column.forEach((value, rowIndex) => {
        if (value !== false) {
          drawCell(rowIndex, columnIndex, value);
        }
      });
    });
  }
}

export class ScoreRenderer {
  #x = 140;
  #y = 10;
  drawScore(score) {
    drawBackground(this.#x, this.#y, 110, 30);
    ctx.fillStyle = "black";
    ctx.font = "15px Arial";
    ctx.fillText("score:" + score, 150, 30);
  }
}

export class NextBlockRenderer {
  #x = 10;
  #y = 10;
  #size = CELL_SIZE * 4;
  drawNextBlock(nextBlock) {
    const pointerLeft = Math.min(...nextBlock.shape.map((arr) => arr[0]));
    const blockWidth = Math.max(...nextBlock.shape.map((arr) => arr[0]));
    const pointerTop = Math.min(...nextBlock.shape.map((arr) => arr[1]));
    const blockHeight = Math.max(...nextBlock.shape.map((arr) => arr[1]));
    drawBackground(this.#x, this.#y, this.#size, this.#size);
    nextBlock.shape.forEach((element) => {
      drawCell(element[0], element[1], nextBlock.color, {
        x: Math.abs(pointerLeft * CELL_SIZE) + (this.#size - blockWidth * CELL_SIZE - CELL_SIZE) / 2,
        y: Math.abs(pointerTop * CELL_SIZE) + (this.#size - blockHeight * CELL_SIZE - CELL_SIZE) / 2,
      });
    });
  }
}

const drawCell = (column, row, color, { x, y } = { x: 0, y: 0 }) => {
  ctx.fillStyle = color;
  ctx.fillRect(column * CELL_SIZE + x, row * CELL_SIZE + y, CELL_SIZE, CELL_SIZE);
  ctx.strokeStyle = "black";
  ctx.strokeRect(column * CELL_SIZE + x, row * CELL_SIZE + y, CELL_SIZE, CELL_SIZE);
};

const drawBackground = (x, y, width, height) => {
  ctx.fillStyle = "white";
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = "black";
  ctx.strokeRect(x, y, width, height);
};

export const canvas = document.getElementById("stage");
export const ctx = canvas.getContext("2d");
