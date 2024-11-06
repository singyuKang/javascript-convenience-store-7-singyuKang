import Product from "./Product.js";

class Products {
  #productList;

  constructor(productArr = []) {
    this.#productList = productArr.map(
      (product) =>
        new Product(
          product.name,
          Number(product.price),
          Number(product.quantity),
          product.promotion
        )
    );
  }
}

export default Products;
