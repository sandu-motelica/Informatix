const searchParams = new URLSearchParams(window.location.search);
import Fetch from "../../utils/Fetch.js";
import { rootPath } from "./constants.js";
const errElement = document?.querySelector(".error");
const memberList = document.querySelector(".class-members-list");
const profName = document.querySelector(".class-content__profesor");

const user = JSON.parse(localStorage.getItem("user"));
if (user.role != "teacher") {
  document.querySelector(".add-member").style.display = "none";
  document.querySelector(".delete-btn").style.display = "none";
} else {
  profName.style.display = "none";
}
const getClassInfo = async () => {
  try {
    const data = await Fetch.get("/class", {
      id: searchParams.get("id"),
    });
    if (data.classes) {
      document.querySelector(".class-content__title").textContent =
        data.classes.name;
      profName.textContent = "Profesor: " + data.prof_name;
      data.members.forEach((member) => {
        const el = document.createElement("li");
        el.textContent = member.username;
        memberList.appendChild(el);
      });
    } else {
      window.location.href = `${rootPath}/classes.html`;
    }
  } catch (e) {
    console.log(e);
  }
};

if (searchParams.has("id")) {
  getClassInfo();
} else window.location.href = `${rootPath}/classes.html`;

let last_username;

window.addMember = async () => {
  try {
    const name = document.querySelector(
      '#member-form input[type="text"]'
    )?.value;
    const data = await Fetch.create("/class/member", {
      username: name,
      idClass: searchParams.get("id"),
    });

    if (data.statusCode != 201) {
      errElement.style.color = "red";
      if (!data.errors?.length || data.errors?.length === 0) {
        errElement.textContent = data?.message || "User inexistent";
      } else if (data?.errors?.length) {
        errElement.textContent = data.errors[0].msg;
      }
    } else if (last_username != name) {
      last_username = name;
      errElement.style.color = "#1da09c";
      errElement.textContent = "Membru adaugat cu succes";
      const el = document.createElement("li");
      el.textContent = name;
      memberList.appendChild(el);
    }
  } catch (e) {
    console.log(e);
  }
};

const popup = document.querySelector(".popup-delete");
document.querySelector(".delete-btn").addEventListener("click", function () {
  popup.style.display = "flex";
});

const closeBtns = document.querySelectorAll(".popup-delete__close");
closeBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    popup.style.display = "none";
  });
});

const errDelete = document.querySelector(".error-delete");
window.removeClass = async () => {
  try {
    const data = await Fetch.remove("/class", {
      classId: searchParams.get("id"),
    });
    if (data.statusCode != 200) {
      if (!data.errors?.length || data.errors?.length === 0) {
        errDelete.textContent = data?.message || "User inexistent";
      } else if (data?.errors?.length) {
        errDelete.textContent = data.errors[0].msg;
      }
    } else {
      window.location.href = `${rootPath}/classes.html`;
    }
  } catch (e) {
    console.log(e);
  }
};
