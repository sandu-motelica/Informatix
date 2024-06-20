import unauthorizedRedirect from "./unauthorized.js";
import Fetch from "../../utils/Fetch.js";
unauthorizedRedirect();

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
    console.log(data);
    try {
      const { problems } = data;
      problems.forEach((item) => {
        console.log(item);
        let tr = document.createElement("tr");
        tr.setAttribute("data-id", item?.id);

        const dateStr = item?.created_time;
        const date = new Date(dateStr);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const year = date.getFullYear();

        tr.innerHTML = `
          <th>${day}/${month}/${year}</th>
          <th><a href="/problem.html?id=${item?.id}">${item?.title}</a></th>
          <th>${item?.difficulty}</th>
          <th>${item?.tags[0]}</th>
          <th>
          <button data-id='${item?.id}' data-type="approved">Approve</button>
          <button data-id='${item?.id}' data-type="declined">Decline</button>
          </th>
        `;
        document.getElementById("problems-list").appendChild(tr);
      });
      const buttons = document.querySelectorAll("button[data-id]");
      console.log(buttons);
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
