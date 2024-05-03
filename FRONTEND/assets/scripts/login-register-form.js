import Fetch from "../../utils/Fetch.js";

const loggedRedirect = () =>
  //TODO: Should be updated
  (window.location.href = "/FRONTEND/pages/problems.html");

if (localStorage.getItem("token")) loggedRedirect();

const loginBtnTab = document.getElementById("tab-login");
const registerBtnTab = document.getElementById("tab-register");
const loginForm = document.getElementsByClassName("account-connect__login")[0];
const registerForm = document.getElementsByClassName(
  "account-connect__register"
)[0];

window.activateTab = (tab) => {
  if (tab === "login") {
    registerForm.classList.remove("account-connect-hide");
    loginForm.classList.add("account-connect-hide");
  } else {
    registerForm.classList.add("account-connect-hide");
    loginForm.classList.remove("account-connect-hide");
  }
};

window.login = async (e) => {
  let email = document.querySelector(
    '.account-connect__login input[type="email"]'
  )?.value;
  let password = document.querySelector(
    '.account-connect__login input[type="password"]'
  )?.value;

  const data = await Fetch.create("/user/login", {
    email,
    password,
  });
  console.log(data);
  if (data.statusCode != 200) {
    const errElement = document?.querySelector(
      ".account-connect__login .error"
    );
    if (errElement) {
      errElement.textContent = data?.message || "Invalid data";
    }
  } else {
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.accessToken);
    loggedRedirect();
  }
};
