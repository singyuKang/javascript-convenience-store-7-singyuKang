class ConvenienceResultController {
  #boughtProductsInfo = [];
  #promotionProductsInfo = [];

  constructor() {}

  get boughtProductsInfo() {
    return this.#boughtProductsInfo;
  }

  set boughtProductsInfo(value) {
    this.#boughtProductsInfo.push(value);
  }

  get promotionProductsInfo() {
    return this.#promotionProductsInfo;
  }

  set promotionProductsInfo(value) {
    this.#promotionProductsInfo.push(value);
  }
}

export default ConvenienceResultController;
