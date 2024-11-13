import { USER_SAY_NO, USER_SAY_YES } from '../constants.js';
import BoughtProduct from '../domain/BoughtProduct.js';
import { checkTimes } from '../utils/dateTime.js';
import { InputView } from '../view/InputView.js';
import ConvenienceResultController from './ConvenienceResultController.js';

class ConvenienceController {
  #products;
  #promotions;
  #convenienceResultController;

  constructor(products, promotions) {
    this.#products = products;
    this.#promotions = promotions;
    this.#convenienceResultController = new ConvenienceResultController();
  }

  get products() {
    return this.#products;
  }

  get promotions() {
    return this.#promotions;
  }

  get convenienceResultController() {
    return this.#convenienceResultController;
  }

  // readItem : InputProductInfo
  async calculateUserProducts(readItem) {
    const promotionList = this.getPromotionList(readItem);
    const normalList = this.getNormalList(readItem);

    await this.processPromotionProducts(promotionList, readItem);

    // 일반 제품 계산
    if (readItem.quantity !== 0) {
      this.processNormalProducts(normalList, readItem);
    }
  }

  async processPromotionProducts(promotionList, readItem) {
    // 프로모션 제품들 리스트 불러온후 계산
    for (let i = 0; i < promotionList.length; i++) {
      const promotionProduct = promotionList[i];
      const promotion = this.findPromotion(promotionProduct);
      const isPromotionPossibleTime = checkTimes(promotion.start_date, promotion.end_date);
      if (promotionProduct.quantity === 0 || readItem.quantity === 0) {
        continue;
      }

      if (isPromotionPossibleTime) {
        await this.applyPromotion(promotionProduct, promotion, readItem);
      } else {
        this.handleNonPromotionPurchase(promotionProduct, readItem);
      }
    }
  }

  async applyPromotion(promotionProduct, promotion, readItem) {
    const userSetMod = parseInt(readItem.quantity / (promotion.buy + promotion.get));
    const userRemainder = readItem.quantity % (promotion.buy + promotion.get);

    if (promotionProduct.quantity - readItem.quantity >= 0) {
      await this.handlePromotionPurchase(promotionProduct, promotion, readItem, userSetMod, userRemainder);
    } else {
      await this.handlePartialPromotionStock(promotionProduct, promotion, readItem);
    }
  }

  async handlePromotionPurchase(promotionProduct, promotion, readItem, userSetMod, userRemainder) {
    //날짜가 들어가면은 할인 아니면 일반계산
    if (userRemainder === 0) {
      this.addBoughtProduct(promotionProduct, readItem.quantity, true);
      this.addPromotionProduct(promotionProduct, userSetMod, true);
    } else if (userRemainder === promotion.buy) {
      // 무료로 받을수 있는데 추가하시겠습니까 입력 추가
      if (promotionProduct.quantity - (readItem.quantity + promotion.get) < 0) {
        const checkNotPromotion = await InputView.checkNotPromotion(promotionProduct.name, userRemainder);
        if (checkNotPromotion === USER_SAY_YES) {
          this.addBoughtProduct(promotionProduct, userSetMod * (promotion.buy + promotion.get), true);
          this.addBoughtProduct(promotionProduct, userRemainder, false);
          this.addPromotionProduct(promotionProduct, userSetMod, true);
          readItem.quantity = 0;
          promotionProduct.quantity = 0;
        }
      } else {
        await this.offerAdditionalPromotion(promotionProduct, promotion, readItem, userSetMod, userRemainder);
      }
    } else {
      this.addBoughtProduct(promotionProduct, userSetMod * (promotion.buy + promotion.get), true);
      this.addBoughtProduct(promotionProduct, userRemainder, false);
      this.addPromotionProduct(promotionProduct, userSetMod, true);
    }
    promotionProduct.quantity -= readItem.quantity;
    readItem.quantity = 0;
    // break;
  }

  async offerAdditionalPromotion(promotionProduct, promotion, readItem, userSetMod, userRemainder) {
    // 무료로 받을수 있는데 추가하시겠습니까 입력 추가
    const checkPromotion = await InputView.checkGetPromotion(promotionProduct.name, promotion.get);
    if (checkPromotion === USER_SAY_YES) {
      this.addBoughtProduct(promotionProduct, readItem.quantity + promotion.get, true);
      this.addPromotionProduct(promotionProduct, userSetMod + promotion.get, true);
    } else if (checkPromotion === USER_SAY_NO) {
      this.addBoughtProduct(promotionProduct, userSetMod * (promotion.buy + promotion.get), true);
      this.addBoughtProduct(promotionProduct, userRemainder, false);
      this.addPromotionProduct(promotionProduct, userSetMod, true);
    }
  }

  async handlePartialPromotionStock(promotionProduct, promotion, readItem) {
    const promotionSetMod = parseInt(promotionProduct.quantity / (promotion.buy + promotion.get));
    const promotionRemainder = promotionProduct.quantity % (promotion.buy + promotion.get);
    const checkNotPromotion = await InputView.checkNotPromotion(promotionProduct.name, readItem.quantity - promotionSetMod * (promotion.buy + promotion.get));
    if (checkNotPromotion === USER_SAY_YES) {
      this.addBoughtProduct(promotionProduct, promotionSetMod * (promotion.buy + promotion.get), true);
      this.addBoughtProduct(promotionProduct, promotionRemainder, false);
      this.addPromotionProduct(promotionProduct, promotionSetMod + promotion.get, true);
      readItem.quantity -= promotionProduct.quantity;
      promotionProduct.quantity = 0;
    }
  }

  handleNonPromotionPurchase(promotionProduct, readItem) {
    // 날짜 미포함 일반계산
    if (promotionProduct.quantity - readItem.quantity >= 0) {
      this.addBoughtProduct(promotionProduct, readItem.quantity, false);
      promotionProduct.quantity -= readItem.quantity;
      readItem.quantity = 0;
    } else {
      this.addBoughtProduct(promotionProduct, promotionProduct.quantity, false);
      readItem.quantity -= promotionProduct.quantity;
      promotionProduct.quantity = 0;
    }
  }

  processNormalProducts(normalList, readItem) {
    for (let i = 0; i < normalList.length; i++) {
      const normalProduct = normalList[i];
      if (normalProduct.quantity - readItem.quantity >= 0) {
        this.addBoughtProduct(normalProduct, readItem.quantity, false);
        normalProduct.quantity -= readItem.quantity;
        readItem.quantity = 0;
        break;
      } else {
        this.addBoughtProduct(normalProduct, normalProduct.quantity, false);
        readItem.quantity -= normalProduct.quantity;
        normalProduct.quantity = 0;
      }
    }
  }

  addBoughtProduct(product, quantity, isPromotion) {
    this.#convenienceResultController.boughtProductsInfo = new BoughtProduct(product.name, quantity, product.price, isPromotion);
  }

  addPromotionProduct(product, quantity, isPromotion) {
    this.#convenienceResultController.promotionProductsInfo = new BoughtProduct(product.name, quantity, product.price, isPromotion);
  }

  findPromotion(promotionProduct) {
    const filterPromotion = this.#promotions.promotionList.filter((promotion) => promotionProduct.promotion === promotion.name);
    return filterPromotion[0];
  }

  // readItem : InputProductInfo
  matchProductName(readItem) {
    const filterMatchName = this.#products.productList.filter((product) => product.name === readItem.name);
    return filterMatchName;
  }

  getPromotionList(readItem) {
    const filterPromotionList = this.#products.productList.filter((product) => product.name == readItem.name && product.promotion);
    return filterPromotionList;
  }

  getNormalList(readItem) {
    const filterNormalList = this.#products.productList.filter((product) => product.name === readItem.name && !product.promotion);
    return filterNormalList;
  }
}

export default ConvenienceController;
