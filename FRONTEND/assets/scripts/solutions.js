import Fetch from "../../utils/Fetch.js";
import { rootPath } from "./constants.js";
const searchParams = new URLSearchParams(window.location.search);
const problemId = searchParams.get("id");

const getSolutions = async () => {
  const data = await Fetch.get("/solution", {
    id_problem: problemId,
  });

  console.log(data);
  data.solutions.forEach((solution) => {
    let tr = document.createElement("tr");
    tr.setAttribute("data-id", solution?.id);

    const dateStr = solution?.created_time;
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    const problem = solution.id_problem;
    const author = solution.id_student;

    tr.innerHTML = `
          <th>${day}/${month}/${year}</th>
          <th>${author?.username}</th>
          <th>${solution?.grade != 0 ? solution?.grade : "Neevaluata"}</th>
          <th><a href='${rootPath}/problem.html?id=${problemId}&solution=${
      solution.id
    }'>Verifica solutie</a></th>
        `;
    document.getElementById("solutions-list").appendChild(tr);
  });
};

getSolutions();
