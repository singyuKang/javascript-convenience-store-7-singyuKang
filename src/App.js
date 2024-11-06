import { PRODUCT_FILE_PATH, PROMOTION_FILE_PATH } from "./constants.js";
import { FileManager } from "./utils/fileManager.js";

class App {
  async run() {
    const fileManager = new FileManager();
    const productsParsing = await fileManager.parseFile(PRODUCT_FILE_PATH);
    const promotionsParsing = await fileManager.parseFile(PROMOTION_FILE_PATH);
  }
}

export default App;
