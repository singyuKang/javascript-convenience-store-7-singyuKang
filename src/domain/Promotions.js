import Promotion from "./Promotion.js";

class Promotions {
  #promotionList;

  constructor(promotionArr = []) {
    this.#promotionList = promotionArr.map(
      (promotion) =>
        new Promotion(
          promotion.name,
          Number(promotion.buy),
          Number(promotion.get),
          promotion.start_date,
          promotion.end_date
        )
    );
  }
}

export default Promotions;
