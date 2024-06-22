import Fetch from "../../utils/Fetch.js";
import { rootPath } from "./constants.js";
const searchParams = new URLSearchParams(window.location.search);
// const errElement = document?.querySelector(".error");
// const profName = document.querySelector(".homework-content__profesor");
const deleteQst = document.querySelector(".popup-delete__qst");

const problemsList = document.querySelector(".homework-problems");

const user = JSON.parse(localStorage.getItem("user"));
if (user.role != "teacher") {
  document.querySelector(".delete-btn").style.display = "none";
} else {
  // profName.style.display = "none";
}

const getHomeworkInfo = async () => {
  try {
    const data = await Fetch.get("/homework", {
      id_homework: searchParams.get("id"),
    });
    console.log(data);
    if (data) {
      document.querySelector(".homework-content__title").textContent =
        data.homework.name;
      deleteQst.textContent = `Confirmi ștergerea temei "${data.homework.name}"?`;
      console.log(data.problems);
      data.problems.forEach((problem) => {
        console.log("aici");
        const el = document.createElement("li");
        const link = document.createElement("a");
        link.classList.add("problem-link");
        link.href = `${rootPath}/problem.html?id=${problem.id}`;
        link.textContent = problem.title;
        el.appendChild(link);
        problemsList.appendChild(el);
      });
    } else {
      window.location.href = `${rootPath}/classes.html`;
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
window.deleteHomework = async () => {
  try {
    const data = await Fetch.remove("/homework", {
      homeworkId: searchParams.get("id"),
    });
    if (data.statusCode != 200) {
      if (!data.errors?.length || data.errors?.length === 0) {
        errDelete.textContent = data?.message || "Eroare stergere";
      } else if (data?.errors?.length) {
        errDelete.textContent = data.errors[0].msg;
      }
    } else {
      window.location.href = `${rootPath}/class.html?id=${data.id_class}`;
    }
  } catch (e) {
    console.log(e);
  }
};

// const getHomeworks = async () => {
//   try {
//     const data = await Fetch.get("/homework", {
//       id_class: searchParams.get("id"),
//     });
//     if (data) {
//       data.forEach((homework) => {
//         const el = document.createElement("li");
//         const link = document.createElement("a");
//         link.classList.add("homework-link");
//         link.href = `${rootPath}/homework.html?id=${homework.id}`;
//         link.textContent = homework.name;
//         el.appendChild(link);
//         problemsList.appendChild(el);
//       });
//     } else {
//       window.location.href = `${rootPath}/classes.html`;
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };

if (searchParams.has("id")) {
  getHomeworkInfo();
} else window.location.href = `${rootPath}/classes.html`;
