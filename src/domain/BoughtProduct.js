class BoughtProduct {
  #name;
  #quantity;
  #price;
  #isPromotion;

  constructor(name, quantity, price, isPromotion) {
    this.#name = name;
    this.#quantity = quantity;
    this.#price = price;
    this.#isPromotion = isPromotion;
  }

  get name() {
    return this.#name;
  }
  get quantity() {
    return this.#quantity;
  }
  get price() {
    return this.#price;
  }
  get isPromotion() {
    return this.#isPromotion;
  }
  set price(price) {
    this.#price = price;
  }
  set quantity(quantity) {
    this.#quantity = quantity;
  }
}

export default BoughtProduct;
