import FileManager from './utils/FileManager.js';
import ConvenienceController from './controller/ConvenienceController.js';
import Products from './domain/Products.js';
import Promotions from './domain/Promotions.js';
import { InputView } from './view/InputView.js';
import OutputView from './view/OutputView.js';
import { PRODUCT_FILE_PATH, PROMOTION_FILE_PATH, USER_SAY_YES } from './constants.js';
import { Console } from '@woowacourse/mission-utils';

class App {
  async run() {
    // // 파일 입출력
    const fileManager = new FileManager();
    const productsParsing = await fileManager.parseFile(PRODUCT_FILE_PATH);
    const addNonPromotionParsing = fileManager.addNonPromotion(productsParsing);
    const promotionsParsing = await fileManager.parseFile(PROMOTION_FILE_PATH);
    // 도메인 변환
    const products = new Products(addNonPromotionParsing);
    const promotions = new Promotions(promotionsParsing);
    // 편의점 컨트롤러 생성
    const convenienceController = new ConvenienceController(products, promotions);
    let additionalPurchase;
    do {
      OutputView.printMainTitle();
      OutputView.printProductsInfo(convenienceController.products);
      const readItems = await InputView.readItem(convenienceController.products);
      await Promise.all(readItems.map((readItem) => convenienceController.calculateUserProducts(readItem)));
      const membership = await InputView.memberShip();
      OutputView.printReceipt(convenienceController.convenienceResultController, membership);
      additionalPurchase = await InputView.additionalPurchase();
      if (additionalPurchase === USER_SAY_YES) {
        convenienceController.convenienceResultController.resetProducts();
      }
    } while (additionalPurchase === USER_SAY_YES);
  }

  async startConvenienceStore(convenienceController) {}
}

export default App;
