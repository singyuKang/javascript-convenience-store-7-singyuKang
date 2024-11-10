const MINIMUM_PRODUCT_NUMBER = 0;
const NO_PRODUCTS_STRING = '재고 없음';

export const productInfoOutputString = {
  quantityString(quantity) {
    if (quantity === MINIMUM_PRODUCT_NUMBER) {
      return NO_PRODUCTS_STRING;
    } else {
      return `${quantity}개`;
    }
  },

  promotionString(promotion) {
    if (promotion === null) {
      return '';
    } else {
      return promotion;
    }
  },
};

export const InputViewStringHandler = {
  readItemsSplit(items) {
    return items.replaceAll('[', '').replaceAll(']', '').split(',');
  },
};

export const comma = (value) => {
  if (value) {
    let str = String(value);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
  }
  return value;
};
