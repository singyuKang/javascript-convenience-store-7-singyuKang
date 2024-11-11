import { comma, productInfoOutputString } from './utils/stringHandler.js';

export const ERROR_MESSAGE = Object.freeze({
  READ_ITEM: '[ERROR] : 구매하실 상품명과 수량을 형식에 맞춰 입력해주세요',
  OVER_QUANTITY: '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.',
  NOT_IN_PRODUCTS: '[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.',
  FILE_PARSING: '[ERROR] 잘못된 파일 형식 입니다.',
  USER_DECISION: '[ERROR] Y 또는 N 으로 입력해주세요',
});

export const INPUT_MESSAGE = Object.freeze({
  READ_ITEM: '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n',
  GET_PROMOTION: (name, quantity) => `현재 ${name}은(는) ${quantity}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`,
  NOT_PROMOTION: (name, quantity) => `현재 ${name} ${quantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`,
  MEMBERSHIP_MESSAGE: '멤버십 할인을 받으시겠습니까? (Y/N)\n',
  ADDITIONAL_PURCHASE: '감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)\n',
});

export const OUTPUT_MESSAGE = Object.freeze({
  MAIN_TITLE: '안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다.\n',
  PRODUCT_INFO: (product) => `- ${product.name} ${comma(product.price)}원 ${productInfoOutputString.quantityString(product.quantity)} ${productInfoOutputString.promotionString(product.promotion)}`,
  RECEIPT_TITLE: '==============W 편의점================',
  RECEIPT_HEADER: () => {
    return [padString('상품명', 16) + padString('수량', 10) + padString('금액', 10)].join('');
  },
  RECEIPT_PRODUCT: (product) => {
    return [padString(product.name, 16) + padString(product.quantity.toString(), 10) + padString(comma(product.price), 10)].join('');
  },
  RECEIPT_PROMOTION_TITLE: '=============증	     정===============',
  RECEIPT_PROMOTION: (product) => {
    return [padString(product.name, 16) + padString(product.quantity.toString(), 8)].join('');
  },
  RECEIPT_RESULT_TITLE: '======================================',
  RECEIPT_TOTAL_PRICE: (count, price) => {
    return [padString('총구매액', 16) + padString(count.toString(), 8) + padString(comma(price), 12)].join('');
  },
  RECEIPT_PROMOTION_PRICE: (price) => {
    return [padString('행사할인', 16) + padString('', 8) + padString('-' + comma(price), 12)].join('');
  },
  RECEIPT_MEMBERSHIPT: (price) => {
    return [padString('멤버십할인', 16) + padString('', 8) + padString('-' + comma(price), 12)].join('');
  },
  RECEIPT_HAVETOPAY: (price) => {
    return [padString('내실돈', 16) + padString('', 8) + padString(comma(price), 12)].join('');
  },
  RECEIPT_PROMOTION: (product) => {
    return [padString(product.name, 16) + padString(product.quantity.toString(), 8)].join('');
  },
});

const padString = (str, length, padChar = ' ') => {
  const currentWidth = getStringWidth(str);
  const padding = length - currentWidth;
  return str + padChar.repeat(Math.max(0, padding));
};

const getStringWidth = (str) => {
  return [...str].reduce((width, char) => {
    return width + (isKorean(char) ? 2 : 1);
  }, 0);
};

const isKorean = (char) => {
  const unicode = char.charCodeAt(0);
  return (unicode >= 0xac00 && unicode <= 0xd7a3) || (unicode >= 0x3131 && unicode <= 0x318e);
};

const padStringRight = (str, length, padChar = ' ') => {
  const currentWidth = getStringWidth(str);
  const padding = length - currentWidth;
  return padChar.repeat(Math.max(0, padding)) + str;
};

export const PRODUCT_FILE_PATH = './public/products.md';
export const PROMOTION_FILE_PATH = './public/promotions.md';
export const MAXUMUM_MAMBERSHIP_PRICE = 8000;
export const USER_SAY_YES = 'Y';
export const USER_SAY_NO = 'N';
