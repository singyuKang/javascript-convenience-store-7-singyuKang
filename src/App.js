import { PRODUCT_FILE_PATH, PROMOTION_FILE_PATH } from './constants.js';
import ConvenienceController from './controller/ConvenienceController.js';
import Products from './domain/Products.js';
import Promotions from './domain/Promotions.js';
import { FileManager } from './utils/fileManager.js';
import { InputView } from './view/InputView.js';
import OutputView from './view/OutputView.js';
import { Console } from '@woowacourse/mission-utils';

class App {
  async run() {
    // 파일 입출력
    const fileManager = new FileManager();
    const productsParsing = await fileManager.parseFile(PRODUCT_FILE_PATH);
    const promotionsParsing = await fileManager.parseFile(PROMOTION_FILE_PATH);

    // 도메인 변환
    const products = new Products(productsParsing);
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
      if (additionalPurchase === 'Y') {
        convenienceController.convenienceResultController.resetProducts();
      }
    } while (additionalPurchase === 'Y');
  }

  async startConvenienceStore(convenienceController) {}
}

export default App;
