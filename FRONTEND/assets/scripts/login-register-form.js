const loginBtnTab = document.getElementById("tab-login");
const registerBtnTab = document.getElementById("tab-register");
const loginForm = document.getElementsByClassName("account-connect__login")[0];
const registerForm = document.getElementsByClassName(
  "account-connect__register"
)[0];

const activateTab = (tab) => {
  if (tab === "login") {
    registerForm.classList.remove("account-connect-hide");
    loginForm.classList.add("account-connect-hide");
  } else {
    registerForm.classList.add("account-connect-hide");
    loginForm.classList.remove("account-connect-hide");
  }
};
