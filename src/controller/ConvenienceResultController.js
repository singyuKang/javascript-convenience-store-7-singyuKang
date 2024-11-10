import { MAXUMUM_MAMBERSHIP_PRICE } from '../constants.js';

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

  getReceiptProducts() {
    return this.#boughtProductsInfo.reduce((acc, boughtProduct) => {
      const existingProduct = acc.find((item) => item.name === boughtProduct.name);
      if (existingProduct) {
        existingProduct.quantity += boughtProduct.quantity;
      } else {
        acc.push({ name: boughtProduct.name, quantity: boughtProduct.quantity, price: boughtProduct.price });
      }
      return acc;
    }, []);
  }

  getReceiptPromotionsProducts() {
    return this.#promotionProductsInfo.reduce((acc, boughtProduct) => {
      const existingProduct = acc.find((item) => item.name === boughtProduct.name);
      if (existingProduct) {
        existingProduct.quantity += boughtProduct.quantity;
      } else {
        acc.push({ name: boughtProduct.name, quantity: boughtProduct.quantity, price: boughtProduct.price });
      }
      return acc;
    }, []);
  }

  getTotalPrice() {
    let totalPrice = 0;
    this.#boughtProductsInfo.forEach((product) => {
      totalPrice += product.quantity * product.price;
    });
    return totalPrice;
  }

  getPromotionPrice() {
    let promotionPrice = 0;
    this.#promotionProductsInfo.forEach((product) => {
      promotionPrice += product.quantity * product.price;
    });
    return promotionPrice;
  }

  getTotalCount() {
    let totalCount = 0;
    this.#boughtProductsInfo.forEach((product) => {
      totalCount += product.quantity;
    });
    return totalCount;
  }

  calculateMemberShip(membership) {
    if (membership === 'N') {
      return 0;
    }
    let membershipPrice = 0;
    let notPromotionPrice = 0;
    this.#boughtProductsInfo.forEach((product) => {
      if (!product.isPromotion) {
        notPromotionPrice += product.price * product.quantity;
      }
    });
    membershipPrice = (notPromotionPrice * 30) / 100;
    if (membershipPrice > MAXUMUM_MAMBERSHIP_PRICE) {
      return MAXUMUM_MAMBERSHIP_PRICE;
    }
    return membershipPrice;
  }

  calculatePay(membership) {
    const totalPrice = this.getTotalPrice();
    const promotionPrice = this.getPromotionPrice();
    const membershipPrice = this.calculateMemberShip(membership);
    return totalPrice - promotionPrice - membershipPrice;
  }

  resetProducts() {
    this.#boughtProductsInfo = [];
    this.#promotionProductsInfo = [];
  }
}

export default ConvenienceResultController;
