class ConvenienceResultController {
  #boughtProductsInfo = [];

  constructor() {}

  get boughtProductsInfo() {
    return this.#boughtProductsInfo;
  }

  set boughtProductsInfo(value) {
    this.#boughtProductsInfo.push(value);
  }
}

export default ConvenienceResultController;
