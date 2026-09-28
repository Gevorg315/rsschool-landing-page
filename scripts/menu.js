const CARDS_COUNT_MAX = 4;
const CARD_TRANSITION_TIME_MS = 400;

const cardTemplate = document
  .querySelector("#card")
  .content.querySelector(".card");
const menu = document.querySelector(".menu");
const menuButtonsList = menu.querySelector(".menu__categories");
const menuLoadButton = menu.querySelector(".menu__btn-load");
const menuList = menu.querySelector(".menu__list");

let activeCategory = "coffee";
let isFirstRender = true;
let currentWindowWidth;

const createCard = ({ id, name, description, price, category }) => {
  const card = cardTemplate.cloneNode(true);

  card.querySelector(".card__title").textContent = name;
  card.querySelector(".card__desc").textContent = description;
  card.querySelector(".card__price").textContent = `$${price}`;
  card.querySelector(".card__img").src = `img/menu/${category}/${id}.jpg`;
  card.dataset.cardId = id;

  return card;
};

const createCategory = (products) => {
  const fragment = document.createDocumentFragment();
  const filteredProducts = products.filter(
    (product) => product.category === activeCategory
  );

  filteredProducts.forEach((product) => {
    const card = createCard(product);

    fragment.append(card);
  });

  return fragment;
};

const renderCards = (products) => {
  const fragment = createCategory(products);

  menuList.style.opacity = 0;

  if (isFirstRender) {
    isFirstRender = false;
    menuLoadButton.style.animation = "rotation 1.5s linear infinite";
    menuLoadButton.style.display = "flex";
  }

  setTimeout(() => {
    menuList.innerHTML = "";
    menuList.append(fragment);
    menuList.style.opacity = 1;

    menuLoadButton.style.animation = "";
    menuLoadButton.style.display = "";

    if (menuList.childElementCount <= CARDS_COUNT_MAX) {
      menuLoadButton.style.display = "none";
    }
  }, CARD_TRANSITION_TIME_MS);
};

const onMenuLoadButtonClick = () => {
  const cards = menuList.childNodes;

  cards.forEach((card) => {
    const displayProperty = window
      .getComputedStyle(card)
      .getPropertyValue("display");

    if (displayProperty === "none") {
      card.style.opacity = 0;
      card.style.display = "flex";

      setTimeout(() => {
        card.style.opacity = 1;
      });
    }
  });

  menuLoadButton.style.display = "none";
};

const onWindowResize = () => {
  if (
    window.innerWidth < currentWindowWidth &&
    menuList.childElementCount > CARDS_COUNT_MAX
  ) {
    const cards = menuList.childNodes;

    cards.forEach((card) => {
      card.style.display = "";
    });

    menuLoadButton.style.display = "";
  }
  currentWindowWidth = window.innerWidth;
};

const initMenu = (products) => {
  renderCards(products);
  currentWindowWidth = window.innerWidth;

  menuButtonsList.addEventListener("click", (evt) => {
    const button = evt.target.closest(".menu__btn-category");

    if (button && !button.matches(".menu__btn-category--active")) {
      const previousActiveButton = menuButtonsList.querySelector(
        ".menu__btn-category--active"
      );

      previousActiveButton.classList.remove("menu__btn-category--active");
      button.classList.add("menu__btn-category--active");

      button.classList.forEach((className) => {
        if (className.startsWith("menu__btn-category--icon_")) {
          activeCategory = className.slice("menu__btn-category--icon_".length);
        }
      });

      renderCards(products);
    }
  });
};

menuLoadButton.addEventListener("click", onMenuLoadButtonClick);
window.addEventListener("resize", onWindowResize);

export { initMenu };
