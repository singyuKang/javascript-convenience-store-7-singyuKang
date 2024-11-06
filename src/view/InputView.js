import { Console } from "@woowacourse/mission-utils";
import { ERROR_MESSAGE, INPUT_MESSAGE } from "../constants.js";
import OutputView from "./OutputView.js";

const InputView = {
  async readItem() {
    while (true) {
      try {
        const input = await Console.readLineAsync(INPUT_MESSAGE.LOTTO_MONEY);
        InputValidation.itemValidate(input);
        return input;
      } catch (error) {
        OutputView.printError(error);
      }
    }
  },
};

const InputValidation = {
  itemValidate(items) {
    if (false) {
      throw new Error(ERROR_MESSAGE.READ_ITEM);
    }
  },
};

export { InputView };
