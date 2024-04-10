const template = document.createElement("template");
template.innerHTML = `
<header class="header">
<div class="container header-main">
  <div>
    <a href="#" class="logo"
      >In<span class="logo-color">&lt;form&gt;</span>mati<span
        class="logo-color"
        >X</span
      ></a
    >
  </div>
  <nav>
    <ul class="nav-list">
      <li class="nav-list-el page-active"><a href="">Probleme</a></li>
      <li class="nav-list-el"><a href="">Discutii</a></li>
      <li class="nav-list-el"><a href="">Clase</a></li>
      <li class="nav-list-el"><a href="">Profil</a></li>
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
</header>`;

document.body.appendChild(template);

// const menuBtn = document.querySelector(".header__menu");
// const closeBtn = document.querySelector(".header__menu-close");
// const navMenu = document.querySelector(".nav-list");

// menuBtn.addEventListener("click", () => {
//   navMenu.classList.add("open-menu");
// });
// closeBtn.addEventListener("click", () => {
//   navMenu.classList.remove("open-menu");
// });
