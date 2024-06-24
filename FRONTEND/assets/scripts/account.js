import unauthorizedRedirect from "./unauthorized.js";
import Fetch from "../../utils/Fetch.js";
import { rootPath } from "./constants.js";
unauthorizedRedirect();

const user = JSON.parse(localStorage.getItem("user"));
if (user.role != "student") {
  document.querySelector(".account__stats-wrapper").style.display = "none";
}

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
      const name = document.querySelector(".account__info__name");
      name.textContent = user.username;
    } catch (e) {
      console.log(e);
    }
  }
};

const getSolutions = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const data = await Fetch.get("/solution", {
    id_student: user.id,
  });

  const solutionsBlock = document.querySelector(
    ".account__stats-solved-problems"
  );
  data.solutions.forEach((item) => {
    const dateStr = item?.created_time;
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

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

    let a = document.createElement("a");
    a.href = `${rootPath}/problem.html?id=${item.id_problem.id}&solution=${item.id}`;
    a.classList.add("account__stats__problem");
    a.innerHTML = `${item.id_problem.title} - (${
      item?.grade > 0 ? item?.grade : "Neevaluata"
    }) <span>${day}/${month}/${year}</span>`;
    solutionsBlock.appendChild(a);
  });
};

const getProblems = async () => {
  const data = await Fetch.get("/problem", {
    status: "approved",
  });

  const easyProblems = data?.problems.filter(
    (item) => item?.difficulty === "easy"
  );
  document.querySelector(
    ".account__statistic--easy .account__statistic__problems"
  ).innerHTML = easyProblems.length;
  const mediumProblems = data?.problems.filter(
    (item) => item?.difficulty === "medium"
  );
  document.querySelector(
    ".account__statistic--medium .account__statistic__problems"
  ).innerHTML = mediumProblems.length;
  const hardProblems = data?.problems.filter(
    (item) => item?.difficulty === "hard"
  );
  document.querySelector(
    ".account__statistic--hard .account__statistic__problems"
  ).innerHTML = hardProblems.length;
  easyProblemsLength = easyProblems.length;
  mediumProblemsLength = mediumProblems.length;
  hardProblemsLength = hardProblems.length;
};

getUserInfo();
await getProblems();
await getSolutions();
