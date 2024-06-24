import Fetch from "../../utils/Fetch.js";

const adminLogin = window.location.href.includes("/admin/login") ? true : false;

const loggedRedirect = () =>
  (window.location.href = !adminLogin
    ? "/FRONTEND/pages/problems.html"
    : "/FRONTEND/pages/admin/dashboard.html");

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
    admin: adminLogin,
  });

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

window.register = async () => {
  let username = document.querySelector(
    '.account-connect__register input[type="text"]'
  )?.value;
  let email = document.querySelector(
    '.account-connect__register input[type="email"]'
  )?.value;
  let password = document.querySelector(
    '.account-connect__register input[type="password"]'
  )?.value;

  const fieldset = document.querySelector(".account-connect__register");
  const radioButtons = fieldset.querySelectorAll(
    '.account-connect__register fieldset input[type="radio"]'
  );
  let role = null;
  radioButtons.forEach((radioButton) => {
    if (radioButton.checked) {
      role = radioButton.value;
    }
  });

  const data = await Fetch.create("/user/register", {
    username,
    email,
    password,
    role,
  });

  if (data.statusCode != 200) {
    console.log(data);
    const errElement = document?.querySelector(
      ".account-connect__register .error"
    );
    if (errElement && data.errors.length === 0) {
      errElement.textContent = data?.message || "Invalid data";
    } else {
      if (data.errors.length) {
        errElement.textContent = data.errors[0].msg;
      } else {
        errElement.textContent = "";
      }
    }
  } else {
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.accessToken);
    loggedRedirect();
  }
};
