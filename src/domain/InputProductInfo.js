class InputProductInfo {
  #name;
  #quantity;

  constructor(name, quantity) {
    this.#name = name;
    this.#quantity = quantity;
  }

  get name() {
    return this.#name;
  }

  get quantity() {
    return this.#quantity;
  }
}

export default InputProductInfo;
