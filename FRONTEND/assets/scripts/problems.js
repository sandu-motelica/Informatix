import unauthorizedRedirect from "./unauthorized.js";
import Fetch from "../../utils/Fetch.js";
unauthorizedRedirect();

const tags = document.getElementsByClassName("tag");

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

const getProblems = async () => {
  const data = await Fetch.get("/problem");
  if (data?.statusCode === 200) {
    console.log(data);
    try {
      const { problems } = data;
      problems.forEach((item) => {
        let tr = document.createElement("tr");
        tr.setAttribute("data-id", item?._id);

        const dateStr = item?.created_time;
        const date = new Date(dateStr);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const year = date.getFullYear();

        tr.innerHTML = `
          <th>${day}/${month}/${year}</th>
          <th><a href="./problem.html?id=${item?._id}">${item?.title}</a></th>
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

getProblems();
