import Block, { BLOCK } from "./block.js";
import Field from "./field.js";
import { canvas, ctx, CellRenderer, ScoreRenderer, NextBlockRenderer } from "./render.js";

const keys = Object.keys(BLOCK);
const randomBlockKey = () => keys[Math.floor(Math.random() * keys.length)];

/**
 * 다른 클래스들을 관리하는 클래스
 */
class Main {
  #score = 0;
  #field = new Field();
  #nextBlock = new Block(BLOCK[randomBlockKey()]);
  #currentBlock = new Block(BLOCK[randomBlockKey()]);
  #blockRender = new CellRenderer();
  #fieldRender = new CellRenderer();
  #scoreRender = new ScoreRenderer();
  #nextBlockRender = new NextBlockRenderer();
  #eventHandler = new Event(this, this.#currentBlock, this.#field);
  constructor() {
    this.render();
  }

  addScore = (score) => {
    this.#score += score;
  };

  #spawnBlock() {
    this.#currentBlock = this.#nextBlock;
    this.#nextBlock = new Block(BLOCK[randomBlockKey()]);
    this.#eventHandler.block = this.#currentBlock;
  }

  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.#blockRender.drawBlock(this.#currentBlock.blockArray);
    this.#fieldRender.drawBlock(this.#field.fieldArray);
    this.#scoreRender.drawScore(this.#score);
    this.#nextBlockRender.drawNextBlock(this.#nextBlock);
  }

  collisionEvent() {
    const isCollision = this.#currentBlock.checkStackable(this.#field.fieldArray);
    if (isCollision) {
      this.#field.addBlock(this.#currentBlock.blockArray);
      this.#field.checkAndClearRow(this.addScore);
      this.#spawnBlock();
    }
    this.render();
  }
}

/**
 * 이벤트를 game에게 위임받아 발생시키는 클래스
 */
class Event {
  #main;
  #block;
  #field;
  constructor(main, block, field) {
    this.#main = main;
    this.#block = block;
    this.#field = field;

    document.getElementById("left").addEventListener("click", () => this.#block.moveLeft(this.#field.fieldArray));
    document.getElementById("right").addEventListener("click", () => this.#block.moveRight(this.#field.fieldArray));
    document.getElementById("up").addEventListener("click", () => this.#block.rotate(this.#field.fieldArray));
    document.getElementById("down").addEventListener("click", () => this.#block.drop(this.#field.fieldArray));
    // document.getElementById("down").addEventListener("click", () => this.#falling());
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.#block.moveLeft(this.#field.fieldArray);
      if (e.key === "ArrowRight") this.#block.moveRight(this.#field.fieldArray);
      if (e.key === "ArrowUp") this.#block.rotate(this.#field.fieldArray);
      if (e.key === "ArrowDown") this.#block.drop(this.#field.fieldArray);
      //   if (e.key === "ArrowDown") this.#falling();
      this.#main.collisionEvent();
      this.#main.render();
    });
  }
  // #falling() {
  //   this.#block.fall();
  //   if (!this.#block.isFalling) return;
  //   requestAnimationFrame(() => this.#falling());
  // }

  //블럭은 새로 생성되므로 새로 생성하는 경우 이벤트 인스턴스에 다시 할당해줘야함
  set block(block) {
    this.#block = block;
  }
}

new Main();
