import { FIELD_HEIGHT, FIELD_WIDTH } from "./field.js";

class Block {
  #x = 6;
  #y = 3;
  #shape;
  #color;
  #blockArray;
  //#isFalling = false;
  constructor(BLOCK) {
    this.#shape = BLOCK.shape;
    this.#color = BLOCK.color;
    this.#blockArray = this.#getBlockArray(this.#shape);
  }
  get x() {
    return this.#x;
  }
  get y() {
    return this.#y;
  }
  get blockArray() {
    return this.#blockArray;
  }
  //   get isFalling() {
  //     return this.#isFalling;
  //   }
  get shape() {
    return this.#shape;
  }
  get color() {
    return this.#color;
  }

  /**
   * 즉시 바닥으로 떨어지는 함수
   * 1.필요한 fieldArray와 blockArray를 계산하기 쉽도록 희소행렬로 변환 및 검사하는 column 체크
   * 2.fieldMinHeight와 blockMaxHeight에 변환된 희소행렬의 2차원 값을 column별로 저장하고 2차원 값을 column 별로 min/max로 저장
   * 3.column 별로 fieldMinHeight - blockMaxHeight 계산 후 가장 작은 차이 값을 minGap에 저장
   * 4.fieldArray가 없는 경우 FIELD_HEIGHT or minGap만큼 블럭의 y를 더함
   */
  drop(fieldArray) {
    const leftWidth = Math.min(...this.#shape.map((arr) => arr[0])); //shape 행렬의 1차원 배열의 최소값이 커서로부터 가장 좌측
    const rightWidth = Math.max(...this.#shape.map((arr) => arr[0])); //shape 행렬의 1차원 배열의 최대값이 커서로부터 가장 우측
    const bottomHeight = Math.max(...this.#shape.map((arr) => arr[1])); //shape 행렬의 2차원 배열의 최대값이 커서로부터 가장 아래
    const fieldCoordinate = [];
    const blockCoordinate = [];
    const checkColumn = [];

    for (let i = 0; i < FIELD_HEIGHT; i++) {
      for (let j = leftWidth + this.#x; j < rightWidth + this.#x + 1; j++) {
        if (this.#blockArray[i][j]) {
          blockCoordinate.push([j, i]);
        }
        if (fieldArray[i][j]) {
          fieldCoordinate.push([j, i]);
        }
        if (!checkColumn.includes(j)) {
          checkColumn.push(j);
        }
      }
    }
    let fieldMinHeight = checkColumn.map((column) =>
      Math.min(...fieldCoordinate.filter((element) => element[0] === column).map((element) => element[1]))
    );
    let blockMaxHeight = checkColumn.map((column) =>
      Math.max(...blockCoordinate.filter((element) => element[0] === column).map((element) => element[1]))
    );
    const minGap = Math.min(...fieldMinHeight.map((element, index) => element - blockMaxHeight[index])) - 1;
    this.#y += minGap === Infinity ? FIELD_HEIGHT - 1 - bottomHeight - this.#y : minGap;
    this.#blockArray = this.#getBlockArray(this.#shape);
  }
  //   fall() {
  //     this.#y += 1;
  //     this.#blockArray = this.#getBlockArray(this.#shape);
  //     this.#isFalling = true;
  //   }

  /**
   * 블럭이 쌓일 수 있는지 체크후 반환
   * 조건1: 가장 아래 블럭이 필드 최대높이에 위치할때
   * 조건2: fieldArray과 blockArray의 y-1한 위치가 일치할때
   * @param {boolean[][]} fieldArray - 일반행렬
   * @returns {boolean} - 참이면 블럭이 필드에 쌓일수있음
   */
  checkStackable(fieldArray) {
    const bottomHeight = Math.max(...this.#shape.map((arr) => arr[1])); //shape 행렬의 2차원 배열의 최대값이 커서로부터 가장 아래
    //조건1: 가장 아래 블럭이 필드 최대 높이에 위치할때
    if (this.#y + bottomHeight >= FIELD_HEIGHT - 1) {
      return true;
    }
    //조건2: fieldArray과 blockArray의 y-1한 위치가 일치할때
    const isFieldCollision = fieldArray.some((row, rowIndex) =>
      row.some((value, columnIndex) => value && this.#blockArray[rowIndex - 1][columnIndex])
    );
    if (isFieldCollision) return true;
  }
  rotate(fieldArray) {
    /**
     * 회전하기전 회전이 이상없는지 체크하는 함수
     * 조건1:미리생성한 회전배열에서 셀 갯수가 4개 이하
     * 조건2:회전했을때 fieldArray와 충돌하지 않는지
     * @param {number[][]} shapeArray 희소행렬
     * @param {string|boolean[][]} fieldArray 일반행렬
     */
    const checkRotate = (shapeArray, fieldArray) => {
      const rotateShapeArray = (shapeArray) => {
        //현재 행렬에서 시계방향 90도회전
        return shapeArray.map((shape) => {
          const [x, y] = shape;
          return [y, -x];
        });
      };
      //회전 예상 배열을 미리 생성
      const rotateShape = rotateShapeArray(shapeArray);
      const rotateArray = this.#getBlockArray(rotateShape);
      //조건1:셀이 4개 이하인지 확인
      let count = rotateArray.flat().filter((value) => value).length;
      if (count < 4) {
        return;
      }
      //조건2:회전할때 fieldArray와 충돌하지 않는지 확인
      const isFieldCollision = fieldArray.some((row, rowIndex) =>
        row.some((value, columnIndex) => value && rotateArray[rowIndex][columnIndex])
      );
      if (isFieldCollision) return;
      this.#shape = rotateShape;
      this.#blockArray = rotateArray;
    };
    checkRotate(this.#shape, fieldArray);
  }

  /**
   * 희소행렬을 받아서 새 일반행렬을 생성하는 함수
   * @param {number[][]} shapeArray 희소행렬
   * @returns {string | boolean[][]} 일반행렬
   */
  #getBlockArray(shapeArray) {
    const array = new Array(FIELD_HEIGHT).fill().map(() => new Array(FIELD_WIDTH).fill(false));
    shapeArray.forEach((element) => {
      if (this.#x + element[0] > FIELD_WIDTH - 1) return;
      if (this.#x + element[0] < 0) return;
      if (this.#y + element[1] > FIELD_HEIGHT - 1) return;
      if (this.#y + element[1] < 0) return;
      array[this.#y + element[1]][this.#x + element[0]] = this.#color;
    });
    return array;
  }

  /**
   * 움직일수있는 여부를 반환해주는 함수
   * @param {string | boolean[][]} blockArray - 일반행렬
   * @param {number} x - 커서 x 위치
   * @returns {boolean} - 참이면 움직일 수 없음
   */
  #checkMovable(fieldArray, x) {
    return fieldArray.some((row, rowIndex) =>
      row.some(
        (value, columnIndex) =>
          value && this.#blockArray[rowIndex][columnIndex + x] && columnIndex + x >= 0 && columnIndex + x < FIELD_WIDTH
      )
    );
  }
  moveLeft(fieldArray) {
    const leftWidth = Math.min(...this.#shape.map((arr) => arr[0])); //shape 행렬의 1차원 배열의 최소값이 커서로부터 가장 좌측
    if (this.#x + leftWidth <= 0) return;
    const isNotMove = this.#checkMovable(fieldArray, 1);
    if (isNotMove) return;
    // if (this.#isFalling) return;
    this.#x -= 1;
    this.#blockArray = this.#getBlockArray(this.#shape);
  }
  moveRight(fieldArray) {
    const rightWidth = Math.max(...this.#shape.map((arr) => arr[0])) + 1; //shape 행렬의 1차원 배열의 최대값이 커서로부터 가장 우측
    if (this.#x + rightWidth > FIELD_WIDTH - 1) return;
    const isNotMove = this.#checkMovable(fieldArray, -1);
    if (isNotMove) return;
    // if (this.#isFalling) return;
    this.#x += 1;
    this.#blockArray = this.#getBlockArray(this.#shape);
  }
}
export default Block;

export const BLOCK = {
  Z: {
    shape: [
      [-1, 0],
      [0, 0],
      [0, 1],
      [1, 1],
    ],
    color: "red",
  },
  S: {
    shape: [
      [1, 0],
      [0, 0],
      [0, 1],
      [-1, 1],
    ],
    color: "yellow",
  },
  I: {
    shape: [
      [-1, 0],
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    color: "green",
  },
  L: {
    shape: [
      [0, -1],
      [0, 0],
      [0, 1],
      [1, 1],
    ],
    color: "cyan",
  },
  J: {
    shape: [
      [0, -1],
      [0, 0],
      [0, 1],
      [1, -1],
    ],
    color: "blue",
  },
  T: {
    shape: [
      [0, -1],
      [0, 0],
      [0, 1],
      [1, 0],
    ],
    color: "purple",
  },
  O: {
    shape: [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    color: "orange",
  },
};
