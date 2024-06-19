import { logout } from "./logout.js";

const header = document.createElement("header");
header.classList.add("header");
header.innerHTML = `
<div class="container header-main">
        <div>
          <a href="./problems.html" class="logo"
            >In<span class="logo-color">&lt;form&gt;</span>mati<span
              class="logo-color"
              >X</span
            ></a
          >
        </div>
        <nav>
          <ul class="nav-list">
            <li class="nav-list-el page-active"><a href="/FRONTEND/pages/problems.html">Probleme</a></li>
            <li class="nav-list-el"><a href="#">Discuții</a></li>
            <li class="nav-list-el"><a href="/FRONTEND/pages/classes.html">Clase</a></li>
            <li class="nav-list-el"><a href="/FRONTEND/pages/account.html">Profil</a></li>
            <li class="nav-list-el disconnect">
              <button class="btn btn-logout">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="logout-icon"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                  />
                </svg>
              </button>
              <a class="disconnect-link" type="button">Deconectare</a>
            </li>
            <li class="logo-mobile-menu">
              <span class="logo"
                >In<span class="logo-color">&lt;form&gt;</span>mati<span
                  class="logo-color"
                  >X</span
                ></span
              >
            </li>
            <li class="header__menu-close">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="header__menu-btn-close"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </li>
          </ul>
          <div class="header__menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="header__menu-btn"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </div>
        </nav>
      </div>
`;

const mainElement = document.getElementsByTagName("main")[0];

mainElement.insertAdjacentElement("beforebegin", header);

const menuBtn = document.querySelector(".header__menu");
const closeBtn = document.querySelector(".header__menu-close");
const navMenu = document.querySelector(".nav-list");
const logoutBtn = document.querySelector(".btn-logout");
const logoutMobileBtn = document.querySelector(".disconnect-link");

menuBtn.addEventListener("click", () => {
  navMenu.classList.add("open-menu");
});

closeBtn.addEventListener("click", () => {
  navMenu.classList.remove("open-menu");
});

logoutBtn.addEventListener("click", () => {
  logout();
});

logoutMobileBtn.addEventListener("click", () => {
  logout();
});

const navElements = document.getElementsByClassName("nav-list-el");

Array.from(navElements).forEach((item) => {
  if (item.getElementsByTagName("a")[0]?.href == window.location.href) {
    item.classList.add("page-active");
  } else item.classList.remove("page-active");
});
