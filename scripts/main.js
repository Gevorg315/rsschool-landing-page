import { addBurgerHandlers } from "./burger.js";
import { initTheme } from "./theme.js";

// Инициализация темы при загрузке
initTheme();

// Инициализация бургер-меню
addBurgerHandlers();

if (document.querySelector(".carousel") !== null) {
  const carouselModule = await import("./carousel.js");
  carouselModule.initCarousel();
}

if (document.querySelector(".menu") !== null) {
  const dataModule = await import("./data.js");
  const menuModule = await import("./menu.js");
  const modalModule = await import("./modal.js");

  const products = await dataModule.dataWithIds();

  menuModule.initMenu(products);
  modalModule.setModalWindowHandlers(products);
}