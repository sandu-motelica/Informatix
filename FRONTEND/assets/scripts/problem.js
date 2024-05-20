import { rootPath } from "./constants.js";
const searchParams = new URLSearchParams(window.location.search);
const problemHeadline = document.getElementsByClassName("problem__title")[0];
import Fetch from "../../utils/Fetch.js";

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
