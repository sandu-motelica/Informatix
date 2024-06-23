import unauthorizedRedirect from "./unauthorized.js";
import Fetch from "../../utils/Fetch.js";
unauthorizedRedirect();

const tags = document.getElementsByClassName("tag");
const user = JSON.parse(localStorage.getItem("user"));

window.searchTag = (event) => {
  Array.from(tags).forEach((item) => {
    if (event.target.value === "") item.style.display = "flex";
    else if (
      item
        .getAttribute("data-name")
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    ) {
      item.style.display = "flex";
    } else item.style.display = "none";
  });
};

window.openRandomProblem = (event) => {
  const rows = document.querySelectorAll("#problems-list tr");
  const problemIDS = Array.from(rows).map((row) => row.getAttribute("data-id"));
  window.location.href = `/FRONTEND/pages/problem.html?id=${
    problemIDS[parseInt(Math.random() * problemIDS.length)]
  }`;
};

window.searchProblem = (event) => {
  if (event.key === "Enter") {
    filterProblems();
  }
};

const getProblems = async () => {
  const difficulty = document.getElementById("dificulty-select").value;
  const is_solved = document.getElementById("status-select").value;
  const search = document.getElementById("search-input").value;
  console.log(search);

  const data = await Fetch.get("/problem", {
    ...(difficulty && difficulty != "all" ? { difficulty } : {}),
    ...(search ? { search } : {}),
    ...(is_solved && is_solved != "all"
      ? { is_solved: is_solved === "resolved" ? true : false }
      : {}),
    status: "approved",
  });

  const activeTags = Array.from(
    document.querySelectorAll("#choice-tags-list button")
  ).map((item) => item.getAttribute("data-name"));

  if (data?.statusCode === 200) {
    try {
      const { problems } = data;
      problems.forEach((item) => {
        if (
          activeTags.filter((value) => item.tags.includes(value)).length != 0 ||
          activeTags.length == 0
        ) {
          let tr = document.createElement("tr");
          tr.setAttribute("data-id", item?.id);

          const dateStr = item?.created_time;
          const date = new Date(dateStr);
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const year = date.getFullYear();

          tr.innerHTML = `
          <th>${day}/${month}/${year}</th>
          <th><a href="./problem.html?id=${item?.id}">${item?.title}</a></th>
          <th>${item?.difficulty}</th>
          <th>${item?.success_rate}</th>
          <th>${item?.tags[0]}</th>
          <th>
          ${
            user.role === "student"
              ? `
            ${
              item?.is_solved
                ? `
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="status-icon">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            `
                : "Nerezolvata"
            }
            `
              : `<a href="./solutions.html?id=${item?.id}">Vezi solutii</a>`
          }
          </th>
        `;
          document.getElementById("problems-list").appendChild(tr);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
};

window.filterProblems = (e) => {
  const problemsList = document.getElementById("problems-list");
  while (problemsList.lastElementChild) {
    problemsList.removeChild(problemsList.lastElementChild);
  }
  getProblems();
};

getProblems();

const getRateData = async () => {
  const difficulty = document.getElementById("dificulty-select").value;
  const is_solved = document.getElementById("status-select").value;
  const data = await Fetch.get("/problem", {
    ...(difficulty && difficulty != "all" ? { difficulty } : {}),
    ...(is_solved && is_solved != "all"
      ? { is_solved: is_solved === "resolved" ? true : false }
      : {}),
  });
  if (data?.statusCode === 200) {
    try {
      const { problems } = data;
      problems.forEach((item) => {
        let tr = document.createElement("tr");
        tr.setAttribute("data-id", item?.id);

        const dateStr = item?.created_time;
        const date = new Date(dateStr);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const year = date.getFullYear();

        tr.innerHTML = `
          <th>${day}/${month}/${year}</th>
          <th><a href="./problem.html?id=${item?.id}">${item?.title}</a></th>
          <th>${item?.difficulty}</th>
          <th>5/13</th>
          <th>${item?.tags[0]}</th>
          <th>
            ${
              item?.is_solved
                ? `
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="status-icon">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            `
                : "Nerezolvata"
            }
          </th>
        `;
        document.getElementById("problems-list").appendChild(tr);
      });
    } catch (e) {
      console.log(e);
    }
  }
};

function generateTagsButtons(categories) {
  const tags = document.getElementsByClassName("tag");
  const choiceTagsList = document.getElementById("choice-tags-list");
  const wrapper = document.getElementById("tags-list");

  wrapper.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.classList.add("tag");
    button.setAttribute("data-name", category.name);
    button.setAttribute("data-value", category.id);

    const textNode = document.createTextNode(category.name);
    button.appendChild(textNode);

    const span = document.createElement("span");
    const spanTextNode = document.createTextNode(category.count);
    span.appendChild(spanTextNode);

    button.appendChild(span);

    button.addEventListener("click", function () {
      const tagsList = document.getElementById("tags-list");
      if (this.parentNode === choiceTagsList) {
        tagsList.appendChild(this);
      } else {
        choiceTagsList.appendChild(this);
      }
      filterProblems();
    });
    wrapper.appendChild(button);
  });
}

const getTags = async () => {
  const data = await Fetch.get("/tag");
  return generateTagsButtons(
    data.map((item) => ({ id: item._id, name: item.name, count: item.count }))
  );
};

getTags();
