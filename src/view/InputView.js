import { Console } from "@woowacourse/mission-utils";
import { ERROR_MESSAGE, INPUT_MESSAGE } from "../constants.js";
import OutputView from "./OutputView.js";
import { InputViewStringHandler } from "../utils/stringHandler.js";
import InputProductInfo from "../domain/InputProductInfo.js";

const PRODUCT_INPUT_LENGTH = 2;
const PRODUCT_INDEX = 0;
const PRODUCT_QUANTITY_INDEX = 1;

function getInputProductList(input) {
  let productList = [];
  let splitItems = InputViewStringHandler.readItemsSplit(input);
  splitItems.forEach((item) => {
    let splitItem = item.split("-");
    productList.push(
      new InputProductInfo(
        splitItem[PRODUCT_INDEX],
        Number(splitItem[PRODUCT_QUANTITY_INDEX])
      )
    );
  });
  return productList;
}

const InputView = {
  async readItem(products) {
    while (true) {
      try {
        const input = await Console.readLineAsync(INPUT_MESSAGE.READ_ITEM);
        InputValidation.itemValidate(input, products);
        return getInputProductList(input);
      } catch (error) {
        OutputView.printError(error);
      }
    }
  },

  async checkGetPromotion(name, quantity) {
    while (true) {
      try {
        const input = await Console.readLineAsync(
          INPUT_MESSAGE.GET_PROMOTION(name, quantity)
        );
        InputValidation.userDecisionValidate(input);
        return input;
      } catch (error) {
        OutputView.printError(error);
      }
    }
  },

  async checkNotPromotion(name, quantity) {
    while (true) {
      try {
        const input = await Console.readLineAsync(
          INPUT_MESSAGE.NOT_PROMOTION(name, quantity)
        );
        InputValidation.userDecisionValidate(input);
        return input;
      } catch (error) {
        OutputView.printError(error);
      }
    }
  },
};

const InputValidation = {
  itemValidate(items, products) {
    let splitItems = InputViewStringHandler.readItemsSplit(items);
    splitItems.forEach((item) => {
      let splitItem = item.split("-");
      if (
        splitItem.length !== PRODUCT_INPUT_LENGTH ||
        isNaN(parseInt(splitItem[PRODUCT_QUANTITY_INDEX]))
      ) {
        throw new Error(ERROR_MESSAGE.READ_ITEM);
      }
    });
    this.productValidate(items, products);
  },

  productValidate(items, products) {
    const userInputProductList = getInputProductList(items);
    this.productNameCheck(userInputProductList, products);
    this.productCountCheck(userInputProductList, products);
  },

  productNameCheck(userInputProductList, products) {
    userInputProductList.forEach((userProduct) => {
      const isProductAvailable = products.productList.some(
        (product) => product.name === userProduct.name
      );
      if (!isProductAvailable) {
        throw new Error(ERROR_MESSAGE.NOT_IN_PRODUCTS);
      }
    });
  },

  productCountCheck(userInputProductList, products) {
    userInputProductList.forEach((userProduct) => {
      let productCount = 0;
      products.productList.forEach((product) => {
        if (product.name === userProduct.name) {
          productCount += product.quantity;
        }
      });
      if (productCount < userProduct.quantity) {
        throw new Error(ERROR_MESSAGE.OVER_QUANTITY);
      }
    });
  },

  userDecisionValidate(input) {
    if (!(input === "Y" || input === "N")) {
      throw new Error(ERROR_MESSAGE.USER_DECISION);
    }
  },
};

export { InputView };
