import unauthorizedRedirect from "./unauthorized.js";
import Fetch from "../../utils/Fetch.js";
import { rootPath } from "./constants.js";

unauthorizedRedirect();
const userRole = JSON.parse(localStorage.getItem("user"))?.role;
if (userRole != "admin") window.location.href = "/FRONTEND/pages/index.html";

const updateProblemStatus = async (id, status) => {
  const data = await Fetch.update("/problem", {
    problemId: id,
    status,
  });
  if (data?.statusCode === 200) {
    const problemsList = document.getElementById("problems-list");
    while (problemsList.lastElementChild) {
      problemsList.removeChild(problemsList.lastElementChild);
    }
    getProblems();
  } else {
    alert("Error");
  }
};

const getProblems = async () => {
  const data = await Fetch.get("/problem", {
    status: "pending",
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
          <th><a href="${rootPath}/problem.html?id=${item?.id}">${item?.title}</a></th>
          <th>${item?.difficulty}</th>
          <th>${item?.tags[0]}</th>
          <th>
          <button class="approve-btn" data-id='${item?.id}' data-type="approved">Approve</button>
          <button class="decline-btn" data-id='${item?.id}' data-type="declined">Decline</button>
          </th>
        `;
        document.getElementById("problems-list").appendChild(tr);
      });
      const buttons = document.querySelectorAll("button[data-id]");
      buttons.forEach((currentBtn) => {
        currentBtn.addEventListener("click", () =>
          updateProblemStatus(
            currentBtn.getAttribute("data-id"),
            currentBtn.getAttribute("data-type")
          )
        );
      });
    } catch (e) {
      console.log(e);
    }
  }
};

getProblems();
