import BoughtProduct from '../domain/BoughtProduct.js';
import { checkTimes } from '../utils/dateTime.js';
import { InputView } from '../view/InputView.js';
import ConvenienceResultController from './ConvenienceResultController.js';

// prettier-ignor
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

    // 프로모션 제품들 리스트 불러온후 계산
    for (let i = 0; i < promotionList.length; i++) {
      const promotionProduct = promotionList[i];
      const promotion = this.findPromotion(promotionProduct);
      const userSetMod = parseInt(readItem.quantity / (promotion.buy + promotion.get));
      const checkPromotionTimes = checkTimes(promotion.start_date, promotion.end_date);
      const userRemainder = readItem.quantity % (promotion.buy + promotion.get);
      if (promotionProduct.quantity === 0) {
        continue;
      }

      if (checkPromotionTimes) {
        if (promotionProduct.quantity - readItem.quantity >= 0) {
          //날짜가 들어가면은 할인 아니면 일반계산
          if (userRemainder === 0) {
            this.#convenienceResultController.boughtProductsInfo = new BoughtProduct(promotionProduct.name, readItem.quantity, promotionProduct.price, true);
            this.#convenienceResultController.promotionProductsInfo = new BoughtProduct(promotionProduct.name, userSetMod, promotionProduct.price, true);
          } else if (userRemainder === promotion.buy) {
            // 무료로 받을수 있는데 추가하시겠습니까 입력 추가
            const checkPromotion = await InputView.checkGetPromotion(promotionProduct.name, promotion.get);
            if (checkPromotion === 'Y') {
              this.#convenienceResultController.boughtProductsInfo = new BoughtProduct(promotionProduct.name, readItem.quantity + promotion.get, promotionProduct.price, true);
              this.#convenienceResultController.promotionProductsInfo = new BoughtProduct(promotionProduct.name, userSetMod + promotion.get, promotionProduct.price, true);
            } else if (checkPromotion === 'N') {
              this.#convenienceResultController.boughtProductsInfo = new BoughtProduct(promotionProduct.name, userSetMod * (promotion.buy + promotion.get), promotionProduct.price, true);
              this.#convenienceResultController.boughtProductsInfo = new BoughtProduct(promotionProduct.name, userRemainder, promotionProduct.price, false);
              this.#convenienceResultController.promotionProductsInfo = new BoughtProduct(promotionProduct.name, userSetMod, promotionProduct.price, true);
            }
          } else {
            this.#convenienceResultController.boughtProductsInfo = new BoughtProduct(promotionProduct.name, userSetMod * (promotion.buy + promotion.get), promotionProduct.price, true);
            this.#convenienceResultController.boughtProductsInfo = new BoughtProduct(promotionProduct.name, userRemainder, promotionProduct.price, false);
            this.#convenienceResultController.promotionProductsInfo = new BoughtProduct(promotionProduct.name, userSetMod, promotionProduct.price, true);
          }
          promotionProduct.quantity -= readItem.quantity;
          readItem.quantity = 0;
          break;
        } else {
          const promotionSetMod = parseInt(promotionProduct.quantity / (promotion.buy + promotion.get));
          const promotionRemainder = promotionProduct.quantity % (promotion.buy + promotion.get);
          const checkNotPromotion = await InputView.checkNotPromotion(promotionProduct.name, readItem.quantity - promotionSetMod * (promotion.buy + promotion.get));
          if (checkNotPromotion === 'Y') {
            this.#convenienceResultController.boughtProductsInfo = new BoughtProduct(promotionProduct.name, promotionSetMod * (promotion.buy + promotion.get), promotionProduct.price, true);
            this.#convenienceResultController.boughtProductsInfo = new BoughtProduct(promotionProduct.name, promotionRemainder, promotionProduct.price, false);
            this.#convenienceResultController.promotionProductsInfo = new BoughtProduct(promotionProduct.name, promotionSetMod, promotionProduct.price, true);
          } else if (checkNotPromotion === 'N') {
            return;
          }
          readItem.quantity -= promotionProduct.quantity;
          promotionProduct.quantity = 0;
        }
      } else {
        // 날짜 미포함 일반계산
        if (promotionProduct.quantity - readItem.quantity >= 0) {
          this.#convenienceResultController.boughtProductsInfo = new BoughtProduct(promotionProduct.name, readItem.quantity, promotionProduct.price, false);
          promotionProduct.quantity -= readItem.quantity;
          readItem.quantity = 0;
        } else {
          this.#convenienceResultController.boughtProductsInfo = new BoughtProduct(promotionProduct.name, promotionProduct.quantity, promotionProduct.price, false);
          readItem.quantity -= promotionProduct.quantity;
          promotionProduct.quantity = 0;
        }
      }
    }

    // 일반 제품 계산
    if (readItem.quantity !== 0) {
      for (let i = 0; i < normalList.length; i++) {
        const normalProduct = normalList[i];
        if (normalProduct.quantity - readItem.quantity >= 0) {
          this.#convenienceResultController.boughtProductsInfo = new BoughtProduct(normalProduct.name, readItem.quantity, normalProduct.price, false);
          normalProduct.quantity -= readItem.quantity;
          readItem.quantity = 0;
          break;
        } else {
          this.#convenienceResultController.boughtProductsInfo = new BoughtProduct(normalProduct.name, normalProduct.quantity, normalProduct.price, false);
          readItem.quantity -= normalProduct.quantity;
          normalProduct.quantity = 0;
        }
      }
    }
  }

  calculatePromotionDiscount() {}

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
