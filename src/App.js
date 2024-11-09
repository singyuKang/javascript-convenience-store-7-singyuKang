import { PRODUCT_FILE_PATH, PROMOTION_FILE_PATH } from './constants.js';
import ConvenienceController from './controller/ConvenienceController.js';
import Products from './domain/Products.js';
import Promotions from './domain/Promotions.js';
import { FileManager } from './utils/fileManager.js';
import { InputView } from './view/InputView.js';
import OutputView from './view/OutputView.js';

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

    // 시작

    // 타이틀 출력
    OutputView.printMainTitle();
    OutputView.printProductsInfo(convenienceController.products);

    // 구매할 상품 수량입력
    const readItems = await InputView.readItem(convenienceController.products);

    // 계산처리
    readItems.forEach((readItem) => {
      convenienceController.calculateUserProducts(readItem);
    });

    // 멤버십 입력 확인
    const membership = await InputView.memberShip();

    // 구매 상품 내역 증정, 상품 내역, 금액 정보를 출력

    // 추가 구매 여부 확인 안내 문구 여기서 시작부터 반복할수있도록
    const additionalPurchase = await InputView.additionalPurchase();
  }
}

export default App;
