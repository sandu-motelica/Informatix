const loginBtnTab = document.getElementById("tab-login");
const registerBtnTab = document.getElementById("tab-register");
const loginForm = document.getElementsByClassName("account-connect__login")[0];
const registerForm = document.getElementsByClassName(
  "account-connect__register"
)[0];

const activateTab = (tab) => {
  if (tab === "login") {
    loginBtnTab.classList.add("btn-secondary");
    loginBtnTab.classList.remove("btn-outline-secondary");
    registerBtnTab.classList.add("btn-outline-secondary");
    registerBtnTab.classList.remove("btn-secondary");
    loginForm.style.display = "flex";
    registerForm.style.display = "none";
  } else {
    registerBtnTab.classList.add("btn-secondary");
    registerBtnTab.classList.remove("btn-outline-secondary");
    loginBtnTab.classList.add("btn-outline-secondary");
    loginBtnTab.classList.remove("btn-secondary");
    registerForm.style.display = "flex";
    loginForm.style.display = "none";
  }
};
