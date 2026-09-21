const STORAGE_KEY = "coffee-house-theme";

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
};

const getSavedTheme = () => {
  return localStorage.getItem(STORAGE_KEY) || "light";
};

const initTheme = () => {
  const currentTheme = getSavedTheme();
  applyTheme(currentTheme);

  const toggleButtons = document.querySelectorAll(".theme-toggle");
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const activeTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(activeTheme);
      localStorage.setItem(STORAGE_KEY, activeTheme);
    });
  });
};

export { initTheme };