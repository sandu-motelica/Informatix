import Fetch from "../../utils/Fetch.js";
import { rootPath } from "./constants.js";
const searchParams = new URLSearchParams(window.location.search);
// const errElement = document?.querySelector(".error");
// const profName = document.querySelector(".homework-content__profesor");
const deleteQst = document.querySelector(".popup-delete__qst");
let numarProbleme = 0;
const problemsList = document.querySelector(".homework-problems");
const solutionList = document.querySelector(".homework-solutions");
const solutionHeader = document.querySelector(".solutions-section h2");
const nota = document.querySelector(".eval-content");
let isStudent = false;
const user = JSON.parse(localStorage.getItem("user"));
if (user.role === "student") {
  document.querySelector(".delete-btn").style.display = "none";
  isStudent = true;
  solutionHeader.textContent = "Soluțiile mele:";
} else {
  solutionHeader.textContent = "Soluțiile elevilor:";
  // profName.style.display = "none";
}

const getHomeworkInfo = async () => {
  try {
    const data = await Fetch.get("/homework", {
      id_homework: searchParams.get("id"),
    });
    if (data) {
      document.querySelector(".homework-content__title").textContent =
        data.homework.name;
      deleteQst.textContent = `Confirmi ștergerea temei "${data.homework.name}"?`;
      numarProbleme = data.problems.length;
      data.problems.forEach((problem) => {
        console.log(numarProbleme);
        const el = document.createElement("li");
        const link = document.createElement("a");
        link.classList.add("problem-link");
        link.href = `${rootPath}/problem.html?id=${problem.id}`;
        if (isStudent) link.href += `&homework=${searchParams.get("id")}`;
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

const getSolution = async () => {
  try {
    const data = await Fetch.get("/solution", {
      id_homework: searchParams.get("id"),
    });
    if (data) {
      if (isStudent) {
        let suma = 0,
          count = 0;
        data.solutions.forEach((solution) => {
          suma += solution.grade;
          count += solution.grade === 0 ? 0 : 1;
          const el = document.createElement("li");
          el.classList.add("solution-line");
          const link = document.createElement("a");
          link.classList.add("solution-link");
          link.href = `${rootPath}/problem.html?id=${solution.id_problem}&solution=${solution.id}`;
          link.textContent = solution.problemName;
          const evaluateEl = document.createElement("span");
          evaluateEl.style.fontSize = "1.4rem";
          evaluateEl.textContent =
            solution.grade === 0 ? "Neevaluata" : `Evaluata: ${solution.grade}`;
          link.appendChild(evaluateEl);
          el.appendChild(link);
          solutionList.appendChild(el);
        });
        console.log(count);
        console.log(numarProbleme);
        console.log(suma);
        if (count === 0) {
          nota.textContent = "Neevaluată";
          nota.style.color = "yellow";
        } else if (count < numarProbleme) {
          nota.textContent = "Evaluate doar " + count;
          nota.style.color = "yellow";
        } else if (count === numarProbleme) {
          nota.textContent = "Nota " + suma / count;
          nota.style.color = "green";
        }
        console.log(nota);
      } else {
        let lastName = null;
        let list;
        data.solutions.forEach((solution) => {
          if (lastName !== solution.studentName) {
            const st = document.createElement("li");
            st.classList.add("student-list");
            const stHeader = document.createElement("h2");
            stHeader.classList.add("student-name");
            stHeader.textContent = solution.studentName;
            list = document.createElement("ul");
            st.appendChild(stHeader);
            st.appendChild(list);
            solutionList.appendChild(st);
          }
          const el = document.createElement("li");
          el.classList.add("solution-line");
          const link = document.createElement("a");
          link.classList.add("solution-link");
          link.href = `${rootPath}/problem.html?id=${
            solution.id_problem
          }&solution=${solution.id}&homework=${searchParams.get("id")}`;
          link.textContent = solution.problemName;
          const evaluateEl = document.createElement("span");
          evaluateEl.style.fontSize = "1.4rem";
          evaluateEl.textContent =
            solution.grade === 0 ? "Neevaluata" : `Evaluata: ${solution.grade}`;
          link.appendChild(evaluateEl);
          el.appendChild(link);
          list.appendChild(el);
        });
      }
    } else {
      window.location.href = `${rootPath}/classes.html`;
    }
  } catch (e) {
    console.log(e);
  }
};

if (searchParams.has("id")) {
  getHomeworkInfo();
  getSolution();
} else window.location.href = `${rootPath}/classes.html`;
