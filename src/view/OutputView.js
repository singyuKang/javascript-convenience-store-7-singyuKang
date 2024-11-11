import { Console } from '@woowacourse/mission-utils';
import { OUTPUT_MESSAGE } from '../constants.js';

const OutputView = {
  printError(error) {
    Console.print(error.message);
  },

  printMainTitle() {
    Console.print(OUTPUT_MESSAGE.MAIN_TITLE);
  },

  printProductsInfo(products) {
    products.productList.forEach((product) => {
      Console.print(OUTPUT_MESSAGE.PRODUCT_INFO(product));
    });
    this.printNewLine();
  },

  printReceipt(convenienceResultController, membership) {
    this.printNewLine();
    Console.print(OUTPUT_MESSAGE.RECEIPT_TITLE);
    Console.print(OUTPUT_MESSAGE.RECEIPT_HEADER());
    convenienceResultController.getReceiptProducts().forEach((product) => {
      Console.print(OUTPUT_MESSAGE.RECEIPT_PRODUCT(product));
    });
    if (convenienceResultController.getReceiptPromotionsProducts().length > 0) {
      Console.print(OUTPUT_MESSAGE.RECEIPT_PROMOTION_TITLE);
      convenienceResultController.getReceiptPromotionsProducts().forEach((product) => {
        Console.print(OUTPUT_MESSAGE.RECEIPT_PROMOTION(product));
      });
    }
    this.printReceiptResult(convenienceResultController, membership);
  },

  printReceiptResult(convenienceResultController, membership) {
    Console.print(OUTPUT_MESSAGE.RECEIPT_RESULT_TITLE);
    Console.print(OUTPUT_MESSAGE.RECEIPT_TOTAL_PRICE(convenienceResultController.getTotalCount(), convenienceResultController.getTotalPrice()));
    Console.print(OUTPUT_MESSAGE.RECEIPT_PROMOTION_PRICE(convenienceResultController.getPromotionPrice()));
    Console.print(OUTPUT_MESSAGE.RECEIPT_MEMBERSHIPT(convenienceResultController.calculateMemberShip(membership)));
    Console.print(OUTPUT_MESSAGE.RECEIPT_HAVETOPAY(convenienceResultController.calculatePay(membership)));
    this.printNewLine();
  },

  printNewLine() {
    Console.print('\n');
  },
};

export default OutputView;
