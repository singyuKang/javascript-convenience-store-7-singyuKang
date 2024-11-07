import { PRODUCT_FILE_PATH, PROMOTION_FILE_PATH } from "../constants.js";
import Products from "../domain/Products.js";
import Promotions from "../domain/Promotions.js";
import { FileManager } from "../utils/fileManager.js";

class FileController {
  #fileManager;

  constructor() {
    this.#fileManager = new FileManager();
  }

  async getProductsParsing() {
    const productsParsing = await this.#fileManager.parseFile(
      PRODUCT_FILE_PATH
    );
    return productsParsing;
  }

  async getPromotionsParsing() {
    const promotionsParsing = await this.#fileManager.parseFile(
      PROMOTION_FILE_PATH
    );
    return promotionsParsing;
  }

  async getProducts() {
    const productsParsing = await this.getProductsParsing();
    const products = new Products(productsParsing);
    return products;
  }

  async getPromotions() {
    const promotionsParsing = await this.getPromotionsParsing();
    const promotions = new Promotions(promotionsParsing);
    return promotions;
  }
}

export default FileController;
