class ResultInfo {
  #boughtProductsInfo;
  #promotionProductsInfo;
  #totalPrice;
  #promotionDiscount;
  #membershipDiscount;
  #haveToPay;

  constructor(
    boughtProductsInfo,
    promotionProductsInfo,
    totalPrice,
    promotionDiscount,
    membershipDiscount,
    haveToPay
  ) {
    this.#boughtProductsInfo = boughtProductsInfo;
    this.#promotionProductsInfo = promotionProductsInfo;
    this.#totalPrice = totalPrice;
    this.#promotionDiscount = promotionDiscount;
    this.#membershipDiscount = membershipDiscount;
    this.#haveToPay = haveToPay;
  }

  get boughtProductsInfo() {
    return this.#boughtProductsInfo;
  }
  get promotionProductsInfo() {
    return this.#promotionProductsInfo;
  }
  get totalPrice() {
    return this.#totalPrice;
  }
  get promotionDiscount() {
    return this.#promotionDiscount;
  }
  get membershipDiscount() {
    return this.#membershipDiscount;
  }
  get haveToPay() {
    return this.#haveToPay;
  }

  set boughtProductsInfo(value) {
    this.#boughtProductsInfo.push(value);
  }

  set promotionProductsInfo(value) {
    this.#promotionProductsInfo.push(value);
  }

  set totalPrice(value) {
    this.#totalPrice = value;
  }

  set promotionDiscount(value) {
    this.#promotionDiscount = value;
  }

  set membershipDiscount(value) {
    this.#membershipDiscount = value;
  }

  set haveToPay(value) {
    this.#haveToPay = value;
  }
}

export default ResultInfo;
