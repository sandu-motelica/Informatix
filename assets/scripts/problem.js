import { rootPath } from "./constants.js";
const searchParams = new URLSearchParams(window.location.search);
const problemHeadline = document.getElementsByClassName("problem__title")[0];

if (searchParams.has("id")) {
  // problemHeadline.append(searchParams.get('id'))
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
