import Fetch from "../../utils/Fetch.js";
import { rootPath } from "./constants.js";
const searchParams = new URLSearchParams(window.location.search);
const errElement = document?.querySelector(".error");
const memberList = document.querySelector(".class-members-list");
const profName = document.querySelector(".class-content__profesor");
const deleteQst = document.querySelector(".popup-delete__qst");

const homeworkList = document.querySelector(".class-content-homework");

let deleteMemberBtn = `<span></span>`;

const user = JSON.parse(localStorage.getItem("user"));
if (user.role != "teacher") {
  document.querySelector(".add-member").style.display = "none";
  document.querySelector(".delete-btn").style.display = "none";
} else {
  deleteMemberBtn = `<button class="btn delete-member">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="delete-member__icon"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>`;
  profName.style.display = "none";
  const el = document.createElement("li");
  const link = document.createElement("a");
  link.classList.add("add-homework-link");
  link.href = `${rootPath}/add-homework.html?id=${searchParams.get("id")}`;
  link.textContent = "+ Creează tema";
  el.appendChild(link);
  homeworkList.appendChild(el);
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
      deleteQst.textContent = `Confirmi ștergerea clasei "${data.classes.name}"?`;
      data.members.forEach((member) => {
        const el = document.createElement("li");
        const userText = document.createElement("span");
        userText.classList.add("class-member-username");
        userText.textContent = member.username;
        el.appendChild(userText);
        el.innerHTML += deleteMemberBtn;
        memberList.appendChild(el);
      });
      attachDeleteEvents();
    } else {
      window.location.href = `${rootPath}/classes.html`;
    }
  } catch (e) {
    console.log(e);
  }
};

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
      const userText = document.createElement("span");
      userText.classList.add("class-member-username");
      userText.textContent = name;
      el.appendChild(userText);
      el.innerHTML += deleteMemberBtn;
      memberList.appendChild(el);
      attachDeleteEvents();
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

const attachDeleteEvents = () => {
  const deleteButtons = document.querySelectorAll(".delete-member");
  const usernameList = document.querySelectorAll(".class-member-username");

  deleteButtons.forEach((btn, i) => {
    btn.addEventListener("click", async () => {
      try {
        const username = usernameList[i].textContent;
        const data = await Fetch.remove("/class/member", {
          idClass: searchParams.get("id"),
          username: username,
        });
        if (data.statusCode != 200) {
          if (!data.errors?.length || data.errors?.length === 0) {
            errElement.textContent = data?.message || "Eroare la stergere";
          } else if (data?.errors?.length) {
            errElement.textContent = data.errors[0].msg;
          }
        } else {
          memberList.removeChild(
            document.querySelectorAll(".class-members-list li")[i]
          );
        }
      } catch (e) {
        console.log(e);
      }
    });
  });
};

const getHomeworks = async () => {
  try {
    const data = await Fetch.get("/homework", {
      id_class: searchParams.get("id"),
    });
    if (data) {
      data.forEach((homework) => {
        const el = document.createElement("li");
        const link = document.createElement("a");
        link.classList.add("homework-link");
        link.href = `${rootPath}/homework.html?id=${homework.id}`;
        link.textContent = homework.name;
        el.appendChild(link);
        homeworkList.appendChild(el);
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
  getHomeworks();
} else window.location.href = `${rootPath}/classes.html`;
