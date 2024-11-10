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
    const { products, promotions } = await this.initializeData();
    const convenienceController = new ConvenienceController(products, promotions);
    await this.startConvenienceStore(convenienceController);
  }

  async initializeData() {
    const fileManager = new FileManager();
    const productsParsing = await fileManager.parseFile(PRODUCT_FILE_PATH);
    const addNonPromotionParsing = fileManager.addNonPromotion(productsParsing);
    const promotionsParsing = await fileManager.parseFile(PROMOTION_FILE_PATH);
    const products = new Products(addNonPromotionParsing);
    const promotions = new Promotions(promotionsParsing);
    return { products, promotions };
  }

  async startConvenienceStore(convenienceController) {
    let additionalPurchase;
    do {
      this.printConvenienceTitle(convenienceController);
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

  printConvenienceTitle(convenienceController) {
    OutputView.printMainTitle();
    OutputView.printProductsInfo(convenienceController.products);
  }
}

export default App;
