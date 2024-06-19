import { rootPath } from "./constants.js";
const searchParams = new URLSearchParams(window.location.search);
const problemHeadline = document.getElementsByClassName("problem__title")[0];
import Fetch from "../../utils/Fetch.js";

const user = JSON.parse(localStorage.getItem("user"));
if (user.role != "student") {
  document.querySelector(".problem__submit").style.display = "none";
} else {
  document.querySelector(".problem__marks").style.display = "none";
}

const getSolution = async () => {
  try {
    const data = await Fetch.get("/solution", {
      _id: searchParams.get("solution"),
    });
    if (data.solutions?.length) {
      const solution = data.solutions[0];
      const textArea = document.querySelector("textarea");
      textArea.value = solution.content;
      textArea.disabled = true;
    } else {
      window.location.href = `${rootPath}/problem.html?id=${searchParams.get(
        "id"
      )}`;
    }
  } catch (e) {
    console.log(e);
  }
};

console.log(searchParams.get("solution"));
if (searchParams.get("solution")) {
  document.querySelector(".problem__submit").style.display = "none";
  getSolution();
}

const getProblem = async () => {
  try {
    const data = await Fetch.get("/problem", {
      _id: searchParams.get("id"),
    });
    if (data.problems?.length) {
      console.log(data);
      const problem = data.problems[0];
      document.querySelector(".problem__title").textContent = problem.title;
      document.querySelector(".problem__content-text").textContent =
        problem.description;
      document.querySelector(".problem__difficulty").textContent =
        problem.difficulty;
    } else {
      window.location.href = `${rootPath}/problems.html`;
    }
  } catch (e) {
    console.log(e);
  }
};

if (searchParams.has("id")) {
  getProblem();
} else window.location.href = `${rootPath}/problems.html`;

const starEl = document.querySelectorAll(".rating-star-icon");

for (let i = 0; i < starEl.length; i++) {
  starEl[i].addEventListener("click", () => {
    for (let j = 0; j <= starEl.length; j++) {
      if (j <= i) starEl[j].classList.add("rating-star-selected");
      else starEl[j].classList.remove("rating-star-selected");
    }
  });
}

window.sendSolution = async () => {
  try {
    const content = document.getElementById("solution").value;
    const data = await Fetch.create("/solution", {
      id_problem: searchParams.get("id"),
      content,
    });
    if (data.statusCode >= 400) {
      alert(data.message);
      return;
    }

    window.location.href = window.location.href + `&solution=${data.id}`;
  } catch (e) {
    console.log(e);
  }
};
