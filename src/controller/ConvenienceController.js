class ConvenienceController {
  #products;
  #promotions;

  constructor(products, promotions) {
    this.#products = products;
    this.#promotions = promotions;
  }

  get products() {
    return this.#products;
  }

  get promotions() {
    return this.#promotions;
  }

  calculateUserProducts(readItems) {}

  checkPromotion() {}

  checkProductsCount(readItems) {
    // 같은 물품 갯수 확인
  }

  matchProductName() {}
}

export default ConvenienceController;
