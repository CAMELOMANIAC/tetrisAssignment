export const FIELD_WIDTH = 13;
export const FIELD_HEIGHT = 20;

/**
 * 필드 상태를 관리하는 클래스
 */
class Field {
  #fieldArray = [];
  constructor() {
    for (let i = 0; i < FIELD_HEIGHT; i++) {
      this.#fieldArray[i] = new Array(FIELD_WIDTH).fill(false);
    }
  }
  get fieldArray() {
    return this.#fieldArray;
  }

  /**
   * 매개변수로 받은 블럭 배열을 필드배열에 추가
   * @param {string | boolean[][]} blockArray - 일반행렬
   */
  addBlock(blockArray) {
    blockArray.forEach((row, rowIndex) => {
      row.forEach((value, columnIndex) => {
        if (value) {
          this.#fieldArray[rowIndex][columnIndex] = value;
        }
      });
    });
  }

  /**
   * 행이 가득 찼는지 체크하고 행을 제거 및 빈행 추가
   * @param {function} addScore this가 game에 바인딩된 점수 콜백함수
   */
  checkAndClearRow(addScore) {
    this.#fieldArray.forEach((row, rowIndex) => {
      if (row.every((value) => value !== false)) {
        //행중에 모든 행이 false가 없는행(행이 가득 찼는지)
        this.#fieldArray.splice(rowIndex, 1);
        this.#fieldArray.unshift(new Array(FIELD_WIDTH).fill(false));
        addScore(1000);
      }
    });
  }
}

export default Field;
