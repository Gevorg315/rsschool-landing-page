import { debounce, debounceLeading, addSwipeHandlers } from "./util.js";

const SLIDE_SWITCH_INTERVAL = 5800;
const MAX_PROGRESS = 100;
const PROGRESS_STEPS = 20;

const carousel = document.querySelector(".carousel");
const carouselWindow = carousel.querySelector(".carousel__window");
const carouselRow = carouselWindow.querySelector(".carousel__slides-row");
const prevButton = carousel.querySelector(".carousel__btn--prev");
const nextButton = carousel.querySelector(".carousel__btn--next");
const slides = carouselRow.querySelectorAll(".carousel__slide");
const carouselBars = carousel.querySelectorAll(".carousel__bar");


let currentSlide = 0;
let progressValue = 0;
let progBarIntervalId;

const transitionDurationTime =
  Number.parseFloat(
    window.getComputedStyle(carousel).getPropertyValue("transition-duration")
  ) * 1000;

const unsetDebTransition = debounceLeading(() => {
  carouselRow.style.transition = "unset";
}, 250);

const returnDebTransition = debounce(() => {
  carouselRow.style.transition = "";
}, 300);

const repositionSlide = () => {
  const slideShift =
    slides[1].getBoundingClientRect().x - slides[0].getBoundingClientRect().x;

  carouselRow.style.transform = `translateX(-${currentSlide * slideShift}px)`;
};

const progressBarGrow = () => {
  if (progressValue < MAX_PROGRESS) {
    progressValue += MAX_PROGRESS / PROGRESS_STEPS;
    carouselBars[currentSlide].style.width = `${progressValue}%`;
  } else {
    nextSlide();
  }
};

const resetProgressBar = () => {
  progressValue = 0;
  carouselBars[currentSlide].style.width = "0%";
};

const startProgressBarGrowt = () => {
  clearInterval(progBarIntervalId);

  progBarIntervalId = setInterval(() => {
    progressBarGrow();
  }, SLIDE_SWITCH_INTERVAL / PROGRESS_STEPS);
};

const pauseProgressBarGrowt = () => {
  clearInterval(progBarIntervalId);
};

const slideSwitchHandle = (button) => {
  currentSlide = (currentSlide + slides.length) % slides.length;
  repositionSlide();
  startProgressBarGrowt();
  button.disabled = true;

  setTimeout(() => {
    button.disabled = false;
  }, transitionDurationTime);
};

const prevSlide = () => {
  resetProgressBar();
  currentSlide--;
  slideSwitchHandle(prevButton);
};

function nextSlide() {
  resetProgressBar();
  currentSlide++;
  slideSwitchHandle(nextButton);
}

const onWindowResize = () => {
  repositionSlide();
  resetProgressBar();
  unsetDebTransition();
  returnDebTransition();
};

const initCarousel = () => {
  carouselBars.forEach((barNode) => {
    barNode.style.transition = `width ${
      SLIDE_SWITCH_INTERVAL / PROGRESS_STEPS
    }ms linear`;
  });
  startProgressBarGrowt();

  window.addEventListener("resize", onWindowResize);
  prevButton.addEventListener("click", prevSlide);
  nextButton.addEventListener("click", nextSlide);
  slides.forEach((slideNode) => {
    slideNode.addEventListener("mouseenter", pauseProgressBarGrowt);
    slideNode.addEventListener("mouseleave", startProgressBarGrowt);
  });
  carouselWindow.addEventListener("touchstart", pauseProgressBarGrowt, {
    passive: true,
  });
  carouselWindow.addEventListener("touchend", startProgressBarGrowt);
  carouselWindow.addEventListener("contextmenu", (evt) => {
    if (evt.pointerType === "touch") {
      evt.preventDefault();

      setTimeout(startProgressBarGrowt);
    }
  });
  addSwipeHandlers(carousel, nextSlide, prevSlide);
};

export { initCarousel };
