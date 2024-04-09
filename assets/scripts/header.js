const menuBtn = document.querySelector(".header__menu");
const closeBtn = document.querySelector(".header__menu-close");
const navMenu = document.querySelector(".nav-list");

menuBtn.addEventListener("click", () => {
  navMenu.classList.add("open-menu");
});
closeBtn.addEventListener("click", () => {
  navMenu.classList.remove("open-menu");
});
