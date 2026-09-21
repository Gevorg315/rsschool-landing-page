const JSON_DATA = "./products.json";

const parsedData = async () => {
  const response = await fetch(JSON_DATA);

  return response.json();
};

const dataWithIds = async () => {
  const products = await parsedData();
  const categoriesObj = {};

  products.forEach((product) => {
    if (categoriesObj[product.category]) {
      product.id = `${product.category}-${++categoriesObj[product.category]}`;
    } else {
      categoriesObj[product.category] = 1;
      product.id = `${product.category}-${categoriesObj[product.category]}`;
    }
  });

  return products;
};

export { dataWithIds };
