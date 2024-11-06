import { PRODUCT_FILE_PATH, PROMOTION_FILE_PATH } from "./constants.js";
import Products from "./domain/Products.js";
import Promotions from "./domain/Promotions.js";
import { FileManager } from "./utils/fileManager.js";

class App {
  async run() {
    const fileManager = new FileManager();
    const productsParsing = await fileManager.parseFile(PRODUCT_FILE_PATH);
    const promotionsParsing = await fileManager.parseFile(PROMOTION_FILE_PATH);
    const products = new Products(productsParsing);
    const promotions = new Promotions(promotionsParsing);
  }
}

export default App;
