const cardTemplate = document
  .querySelector("#card")
  .content.querySelector(".card");
const menu = document.querySelector(".menu");
const menuLoadButton = menu.querySelector(".menu__btn-load");
const menuList = menu.querySelector(".menu__list");

const createCard = ({ id, name, description, price }) => {
  const card = cardTemplate.cloneNode(true);

  card.querySelector(".card__title").textContent = name;
  card.querySelector(".card__desc").textContent = description;
  card.querySelector(".card__price").textContent = `$${price}`;
  card.querySelector(".card__img").src = `img/menu/coffee/${id}.jpg`;
  card.dataset.cardId = id;

  return card;
};

const renderCards = (products) => {
  const fragment = document.createDocumentFragment();
  const coffeeProducts = products.filter(
    (product) => product.category === "coffee"
  );

  coffeeProducts.forEach((product) => {
    const card = createCard(product);
    fragment.append(card);
  });

  menuList.innerHTML = "";
  menuList.append(fragment);
  menuList.style.opacity = 1;

  // Make the load button visible
  if (menuLoadButton) {
    menuLoadButton.style.display = "flex";
  }
};

const initMenu = (products) => {
  renderCards(products);
};

export { initMenu };