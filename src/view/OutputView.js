import { OUTPUT_MESSAGE } from "../constants.js";

const OutputView = {
  printError(error) {
    Console.print(error.message);
  },

  printMainTitle() {
    Console.print(OUTPUT_MESSAGE.MAIN_TITLE);
  },
};

export default OutputView;
