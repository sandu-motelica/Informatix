import { rootPath } from "./constants.js";
const searchParams = new URLSearchParams(window.location.search);
const problemHeadline = document.getElementsByClassName("problem__title")[0];
import Fetch from "../../utils/Fetch.js";

let problem = {};

if (!searchParams.get("solution")) {
  document.querySelector(".problem__marks").style.display = "none";
}

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
      if (solution.grade) {
        const grades = document.querySelectorAll(".problem__marks button");
        grades.forEach((grade) => {
          if (solution.grade != grade.getAttribute("data-value"))
            grade.disabled = true;
          else grade.style.pointerEvents = "none";
        });
      }
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
      problem = data.problems[0];

      document.querySelector(".problem__title").textContent = problem.title;
      document.querySelector(".problem__content-text").textContent =
        problem.description;
      document.querySelector(".problem__difficulty").textContent =
        problem.difficulty;

      const starEl = document.querySelectorAll(".rating-star-icon");

      for (let i = 0; i < Math.round(problem.rating); i++)
        starEl[i]?.classList.add("rating-star-selected");

      for (let i = Math.round(problem.rating); i < starEl.length; i++)
        starEl[i]?.classList.remove("rating-star-selected");

      document.getElementById("problem-rating").textContent =
        problem.rating.toFixed(1);
    } else {
      window.location.href = `${rootPath}/problems.html`;
    }
    console.log(data);
  } catch (e) {
    console.log(e);
  }
};

if (searchParams.has("id")) {
  getProblem();
} else window.location.href = `${rootPath}/problems.html`;

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

window.exportProblem = () => {
  const blob = new Blob([JSON.stringify(problem)], { type: "text/json" });
  const link = document.createElement("a");

  link.download = problem.title;
  link.href = window.URL.createObjectURL(blob);
  link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

  const evt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  link.dispatchEvent(evt);
  link.remove();
};

const evaluateSolution = async (grade) => {
  try {
    await Fetch.update("/solution", {
      id: searchParams.get("solution"),
      grade,
    });
    getSolution();
    // }
  } catch (e) {
    console.log(e);
  }
};

const rateProblem = async (rate) => {
  try {
    const data = await Fetch.create("/problem/rate", {
      id_problem: searchParams.get("id"),
      rate,
    });
    console.log(data);
    if (data.statusCode != 200) {
      alert("Problem was already rated");
      return;
    }
    getProblem();
  } catch (e) {
    console.log(e);
  }
};

window.init = () => {
  const grades = document.querySelectorAll(".problem__marks button");
  grades.forEach((grade) => {
    grade.addEventListener("click", () =>
      evaluateSolution(grade.getAttribute("data-value"))
    );
  });

  const buttonsRate = document.querySelectorAll(".problem__evaluate li");
  console.log(buttonsRate);
  buttonsRate.forEach((rating) => {
    rating.addEventListener("click", () =>
      rateProblem(rating.getAttribute("data-value"))
    );
  });
};
