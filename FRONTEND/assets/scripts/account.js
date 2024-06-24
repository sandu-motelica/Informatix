import unauthorizedRedirect from "./unauthorized.js";
import Fetch from "../../utils/Fetch.js";
import { rootPath } from "./constants.js";
unauthorizedRedirect();

const user = JSON.parse(localStorage.getItem("user"));
if (user.role !== "student") {
  document.querySelector(".account__stats-wrapper").style.display = "none";
} else if (user.role !== "teacher")
  document.querySelector(".profesor-problems").style.display = "none";

let easyProblemsLength = 0;
let mediumProblemsLength = 0;
let hardProblemsLength = 0;

const searchParams = new URLSearchParams(window.location.search);
const id = searchParams.get("id");

const getUserInfo = async () => {
  const data = await Fetch.get("/user/info");
  if (data?.statusCode === 200) {
    try {
      const { user } = data;
      document.querySelector(".account__info__name").textContent =
        user.username;
      document.querySelector(".account__info__email").textContent = user.email;
    } catch (e) {
      console.log(e);
    }
  }
};

getUserInfo();

const getStudentSolutions = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const data = await Fetch.get("/solution", {
    id_student: user.id,
  });

  const solutionsBlock = document.querySelector(
    ".account__stats-solved-problems"
  );
  const solvedProblems = data.solutions.filter((item) => item.grade > 8);
  const easyProblems = solvedProblems.filter(
    (item) => item.id_problem?.difficulty === "easy"
  );
  document.querySelector(
    ".account__statistic--easy .account__statistic__solutions"
  ).innerHTML = easyProblems.length;
  const mediumProblems = solvedProblems.filter(
    (item) => item.id_problem?.difficulty === "medium"
  );
  document.querySelector(
    ".account__statistic--medium .account__statistic__solutions"
  ).innerHTML = mediumProblems.length;
  const hardProblems = solvedProblems.filter(
    (item) => item.id_problem?.difficulty === "hard"
  );
  document.querySelector(
    ".account__statistic--hard .account__statistic__solutions"
  ).innerHTML = hardProblems.length;

  document.querySelector(
    ".account__statistic--hard .account__statistic__bar--filled"
  ).style.width = `${
    (hardProblems.length * 100) /
    (hardProblemsLength != 0 ? hardProblemsLength : 1)
  }%`;
  document.querySelector(
    ".account__statistic--medium .account__statistic__bar--filled"
  ).style.width = `${
    (mediumProblems.length * 100) /
    (mediumProblemsLength != 0 ? mediumProblemsLength : 1)
  }%`;
  document.querySelector(
    ".account__statistic--easy .account__statistic__bar--filled"
  ).style.width = `${
    (easyProblems.length * 100) /
    (easyProblemsLength != 0 ? easyProblemsLength : 1)
  }%`;

  const notedProblems = data.solutions.filter((item) => item.grade > 0);
  const suma = notedProblems.reduce((acc, curr) => acc + curr.grade, 0);
  document.querySelector(
    ".account__info__rank"
  ).innerHTML = `<span>Nota medie:</span><strong>${
    suma !== 0 ? (suma / notedProblems.length).toFixed(2) : "fara note"
  }</strong> `;
  data.solutions.forEach((item) => {
    const dateStr = item?.created_time;
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    let a = document.createElement("a");
    a.href = `${rootPath}/problem.html?id=${item.id_problem._id}&solution=${item.id}`;
    a.classList.add("account__stats__problem");
    a.innerHTML = `${item.id_problem.title} <span><span class="solution-eval">${
      item?.grade > 0 ? "Evaluat: " + item?.grade : "Neevaluata"
    }</span><span>${day}/${month}/${year}</span></span>`;
    solutionsBlock.appendChild(a);
  });
};
const getProfesorProblem = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const data = await Fetch.get("/problem/profesor", {
    id_profesor: user.id,
  });
  const problemsBlock = document.querySelector(".profesor-problems-list");
  let sum = 0,
    count = 0;
  data.forEach((item) => {
    sum += item.rating;
    item.rating > 0 ? count++ : null;
    const dateStr = item?.created_time;
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    const line = document.createElement("li");
    let link = document.createElement("a");
    link.href = `${rootPath}/problem.html?id=${item.id}`;
    link.classList.add("problem-link");
    link.innerHTML = `${item.title} <span><span class="solution-eval">${
      item.status !== "approve" ? item.status : ""
    }</span><span>${day}/${month}/${year}</span></span>`;
    line.appendChild(link);
    problemsBlock.appendChild(line);
  });
  document.querySelector(".account__info__rank strong").textContent =
    sum > 0 ? (sum / count).toFixed(2) : "0";
};

const getStudentProblems = async () => {
  const data = await Fetch.get("/problem/counter", {});

  document.querySelector(
    ".account__statistic--easy .account__statistic__problems"
  ).textContent = data.easy;

  document.querySelector(
    ".account__statistic--medium .account__statistic__problems"
  ).textContent = data.medium;
  document.querySelector(
    ".account__statistic--hard .account__statistic__problems"
  ).textContent = data.hard;
  easyProblemsLength = data.easy;
  mediumProblemsLength = data.medium;
  hardProblemsLength = data.hard;
};

if (user.role === "student") {
  await getStudentProblems();
  await getStudentSolutions();
} else if (user.role === "teacher") {
  getProfesorProblem();
}
