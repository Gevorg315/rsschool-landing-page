const TABLET_SIZE = 768;

const header = document.querySelector(".header");
const nav = header.querySelector(".header__nav");
const burgerButton = header.querySelector(".header__burger");
const burgerButtonText = burgerButton.querySelector(".visually-hidden");

const openBurgerMenu = () => {
  document.body.classList.add("page__body--js-no-scroll");
  header.classList.add("header--js-burger-opened");
  window.scrollTo({ top: 0, behavior: "smooth" });
  burgerButtonText.textContent = "Close navigation";
  document.addEventListener("keydown", onDocumentKeydown);
};

const closeBurgerMenu = () => {
  document.body.classList.remove("page__body--js-no-scroll");
  header.classList.remove("header--js-burger-opened");
  burgerButtonText.textContent = "Open navigation";
  document.removeEventListener("keydown", onDocumentKeydown);
};

const onBurgerButtonClick = () => {
  if (header.classList.contains("header--js-burger-opened")) {
    closeBurgerMenu();
  } else {
    openBurgerMenu();
  }
};

const onDocumentKeydown = (evt) => {
  if (evt.key === "Escape" && header.classList.contains("header--js-burger-opened")) {
    closeBurgerMenu();
  }
};

const onNavClick = (evt) => {
  const linkNode = evt.target.closest(".nav__link");

  if (linkNode && header.classList.contains("header--js-burger-opened")) {
    if (linkNode.matches("a[href]")) {
      evt.preventDefault();

      nav.addEventListener(
        "transitionend",
        () => {
          window.location.href = linkNode.href;
        },
        { once: true }
      );
    }

    closeBurgerMenu();
  }
};

const onWindowResize = () => {
  if (window.innerWidth > TABLET_SIZE) {
    nav.classList.remove("header__nav--js-transition-added");
    if (header.classList.contains("header--js-burger-opened")) {
      closeBurgerMenu();
    }
  } else {
    nav.classList.add("header__nav--js-transition-added");
  }
};

const addBurgerHandlers = () => {
  burgerButton.addEventListener("click", onBurgerButtonClick);
  nav.addEventListener("click", onNavClick);
  window.addEventListener("resize", onWindowResize);
};

onWindowResize();

export { addBurgerHandlers };