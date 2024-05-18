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

export const getProblems = async () => {
  const data = await Fetch.get("/problem");
  if (data?.statusCode === 200) {
    console.log(data);
    try {
      const { problems } = data;
      problems.forEach((item) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
          <th>12.01.2022</th>
          <th><a href="./problem.html?id=${item?._id}">${item?.title}</a></th>
          <th>${item?.difficulty}</th>
          <th>5/13</th>
          <th>Matematica</th>
          <th>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="status-icon">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
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
