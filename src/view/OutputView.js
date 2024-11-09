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
  },

  printReceipt() {},
};

export default OutputView;
