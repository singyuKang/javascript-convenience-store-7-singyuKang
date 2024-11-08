import BoughtProduct from "../domain/BoughtProduct.js";
import { InputView } from "../view/InputView.js";
import ConvenienceResultController from "./ConvenienceResultController.js";

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

  // readItem : InputProductInfo
  async calculateUserProducts(readItem) {
    const matchProductNameList = this.matchProductName(readItem);
    const promotionList = this.getPromotionList(readItem);
    const normalList = this.getNormalList(readItem);

    // 프로모션 제품들 리스트 불러온후 계산
    for (let i = 0; i < promotionList.length; i++) {
      const promotionProduct = promotionList[i];
      const promotion = this.findPromotion(promotionProduct);
      if (promotionProduct.quantity - readItem.quantity >= 0) {
        // 구매완료

        //날짜가 들어가면은 할인 아니면 일반계산
        const userSetMod = readItem.quantity / (promotion.buy + promotion.get);
        /* prettier-ignore */
        const userRemainder = readItem.quantity % (promotion.buy + promotion.get);
        if (userRemainder === 0) {
          /* prettier-ignore */
          this.#convenienceResultController.boughtProductsInfo = new BoughtProduct(promotionProduct.name, userSetMod * (promotion.buy + promotion.get) ,promotionProduct.price)
          promotionProduct.quantity -= readItem.quantity;
          readItem.quantity = 0;
        } else if (userRemainder === promotion.buy) {
          // 무료로 받을수 있는데 추가하시겠습니까 입력 추가
          /* prettier-ignore */
          const checkPromotion = await InputView.checkGetPromotion(promotionProduct.name, promotion.get);
          // this.#convenienceResultController.boughtProductsInfo = new BoughtProduct(promotionProduct.name, )
        } else {
          /* prettier-ignore */
          this.#convenienceResultController.boughtProductsInfo = new BoughtProduct(promotionProduct.name,readItem.quantity,promotionProduct.price)
          promotionProduct.quantity -= readItem.quantity;
          readItem.quantity = 0;
        }

        break;
      } else {
        // TODO
        readItem.quantity -= promotionProduct.quantity;
        promotionProduct.quantity = 0;
      }
    }

    // 일반 제품 계산
    if (readItem.quantity !== 0) {
      for (let i = 0; i < normalList.length; i++) {
        const normalProduct = normalList[i];
        if (normalProduct.quantity - readItem.quantity >= 0) {
          normalProduct.quantity -= readItem.quantity;
          readItem.quantity = 0;
          break;
        } else {
          readItem.quantity -= normalProduct.quantity;
          normalProduct.quantity = 0;
        }
      }
    }
  }

  calculatePromotion() {}

  findPromotion(promotionProduct) {
    const filterPromotion = this.#promotions.promotionList.filter(
      (promotion) => promotionProduct.promotion === promotion.name
    );
    return filterPromotion[0];
  }

  // readItem : InputProductInfo
  matchProductName(readItem) {
    const filterMatchName = this.#products.productList.filter(
      (product) => product.name === readItem.name
    );
    return filterMatchName;
  }

  getPromotionList(readItem) {
    const filterPromotionList = this.#products.productList.filter(
      (product) => product.name == readItem.name && product.promotion
    );
    return filterPromotionList;
  }

  getNormalList(readItem) {
    const filterNormalList = this.#products.productList.filter(
      (product) => product.name === readItem.name && !product.promotion
    );
    return filterNormalList;
  }
}

export default ConvenienceController;
