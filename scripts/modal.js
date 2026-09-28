const menuList = document.querySelector(".menu__list");
const modalItemTemplate = document
  .querySelector("#modal-item")
  .content.querySelector(".modal__item");
const modal = document.querySelector(".modal");
const image = modal.querySelector(".modal__img");
const modalForm = modal.querySelector(".modal__form");
const formTitle = modalForm.querySelector(".modal__form-title");
const modalDescription = modalForm.querySelector(".modal__desc");
const sizeList = modalForm.querySelector(".modal__list--size");
const additivesList = modalForm.querySelector(".modal__list--additives");
const output = modalForm.querySelector(".modal__output");
const closeButton = modalForm.querySelector(".modal__close-button");

let currentCardData;
let totalPrice = 0;
let sizePrice = 0;

const createCheckBox = ({ name }) => {
  const listItem = modalItemTemplate.cloneNode(true);
  const listItemInput = listItem.querySelector(".rad-check__input");

  listItem.querySelector(".rad-check").classList.add("rad-check--counter");
  listItemInput.setAttribute("type", "checkbox");
  listItemInput.setAttribute("name", name.toLowerCase());
  listItem.querySelector(".rad-check__text").textContent = name;

  return listItem;
};

const createRadio = (property, { size }) => {
  const listItem = modalItemTemplate.cloneNode(true);
  const listItemInput = listItem.querySelector(".rad-check__input");
  const listItemText = listItem.querySelector(".rad-check__text");

  listItemInput.setAttribute("type", "radio");
  listItemInput.setAttribute("name", "size");
  listItemInput.setAttribute("value", property);
  listItemText.textContent = size;
  listItemText.style.setProperty(
    "--pseudo-content",
    `'${property.toUpperCase()}'`
  );

  return listItem;
};

const createListItemsFragment = (dataObject) => {
  const fragment = document.createDocumentFragment();

  if (Array.isArray(dataObject)) {
    dataObject.forEach((item) => {
      const listItem = createCheckBox(item);

      fragment.append(listItem);
    });
  } else {
    let isFirstItem = true;

    for (const property in dataObject) {
      const listItem = createRadio(property, dataObject[property]);

      if (isFirstItem) {
        isFirstItem = false;
        listItem
          .querySelector(".rad-check__input")
          .setAttribute("checked", "true");
      }

      fragment.append(listItem);
    }
  }

  return fragment;
};

const fillList = (listNode, dataObject) => {
  const fragment = createListItemsFragment(dataObject);

  listNode.innerHTML = "";
  listNode.append(fragment);
};

const fillModalData = ({
  id,
  name,
  description,
  category,
  sizes,
  additives,
  price,
}) => {
  image.src = `img/menu/${category}/${id}.jpg`;
  formTitle.textContent = name;
  modalDescription.textContent = description;
  output.textContent = `$${price}`;
  fillList(sizeList, sizes);
  fillList(additivesList, additives);
};

const openModal = () => {
  document.body.style.overflow = "hidden";
  fillModalData(currentCardData);
  modal.showModal();
  totalPrice = Number.parseFloat(currentCardData.price);
  sizePrice = 0;

  document.addEventListener("keydown", onDocumentKeydown);
};

const closeModal = () => {
  document.body.style.overflow = "visible";
  modal.close();
  modalForm.reset();

  document.removeEventListener("keydown", onDocumentKeydown);
};

const onCloseButtonClick = () => {
  closeModal();
};

const onModalClick = (evt) => {
  if (evt.target === modal) {
    closeModal();
  }
};

function onDocumentKeydown(evt) {
  if (evt.key === "Escape") {
    evt.preventDefault();

    closeModal();
  }
}

const setModalWindowHandlers = (products) => {
  menuList.addEventListener("click", (evt) => {
    const cardNode = evt.target.closest(".card");

    if (cardNode) {
      const cardId = cardNode.dataset.cardId;
      currentCardData = products.find(({ id }) => id === cardId);

      openModal();
    }
  });
};

sizeList.addEventListener("change", (evt) => {
  const input = evt.target.closest(".rad-check__input");

  if (input) {
    const sizeAttribute = input.getAttribute("value");
    const sizePriceString = currentCardData.sizes[sizeAttribute]["add-price"];
    const sizePriceFloat = Number.parseFloat(sizePriceString);

    totalPrice -= sizePrice;
    sizePrice = sizePriceFloat;
    totalPrice += sizePrice;
    output.textContent = `$${totalPrice.toFixed(2)}`;
  }
});

additivesList.addEventListener("change", (evt) => {
  const input = evt.target.closest(".rad-check__input");

  if (input) {
    const nameAttribute = input.getAttribute("name");
    const additivesArray = currentCardData.additives;
    const additivesItem = additivesArray.find(
      (additive) => additive.name.toLowerCase() === nameAttribute
    );
    const additivePriceString = additivesItem["add-price"];
    const additivePriceFloat = Number.parseFloat(additivePriceString);

    totalPrice += input.checked ? additivePriceFloat : -additivePriceFloat;
    output.textContent = `$${totalPrice.toFixed(2)}`;
  }
});

closeButton.addEventListener("click", onCloseButtonClick);
modal.addEventListener("click", onModalClick);

export { setModalWindowHandlers };
