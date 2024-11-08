class BoughtProduct {
  #name;
  #quantity;
  #price;

  constructor(name, quantity, price) {
    this.#name = name;
    this.#quantity = quantity;
    this.#price = price;
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
  set price(price) {
    this.#price = price;
  }
  set quantity(quantity) {
    this.#quantity = quantity;
  }
}

export default BoughtProduct;
