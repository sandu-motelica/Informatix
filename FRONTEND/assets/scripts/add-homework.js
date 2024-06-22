import unauthorizedRedirect from "./unauthorized.js";
import Fetch from "../../utils/Fetch.js";
import { rootPath } from "./constants.js";

const searchParams = new URLSearchParams(window.location.search);

unauthorizedRedirect();

const errElement = document?.querySelector(".error");

const problemsList = document.getElementById("problems-list");
const pedingProblemsList = document.querySelector(".pending-problems");

document.querySelector(
  ".btn-add-problem"
).href = `${rootPath}/add-problem.html?homework=${searchParams.get("id")}`;

const getProblems = async () => {
  const search = document.getElementById("search-input").value;

  const data = await Fetch.get("/problem", {
    ...(search ? { search } : {}),
    status: "approved",
  });
  if (data?.statusCode === 200) {
    try {
      const { problems } = data;
      problems.forEach((item) => {
        let tr = document.createElement("tr");
        tr.setAttribute("data-id", item?.id);

        tr.innerHTML = `
          <th>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="checked-icon"
            >
              <path
                fill-rule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                clip-rule="evenodd"
              />
            </svg>
          </th>
          <th class="problem-name">${item?.title}</th>
          <th class="problem-difficulty">${item?.difficulty}</th>
          <th class="problem-category">${item?.tags[0]}</th>
        `;

        problemsList.appendChild(tr);
      });
      attachCheckedEvents();
    } catch (e) {
      console.log(e);
    }
  }
};

const getPendingProblems = async () => {
  const data = await Fetch.get("/problem/pending", {});
  console.log(data);
  if (data?.statusCode === 200) {
    try {
      const { problems } = data;
      problems.forEach((item) => {
        const el = document.createElement("li");
        el.classList.add("pending-pr");
        el.setAttribute("data-id", item?._id);
        el.textContent = item.title;
        pedingProblemsList.appendChild(el);
      });
    } catch (e) {
      console.log(e);
    }
  }
};

const attachCheckedEvents = () => {
  const problemsList = document.querySelectorAll("#problems-list tr");
  problemsList.forEach((line) => {
    line.addEventListener("click", async () => {
      line.classList.toggle("checked");
    });
  });
};

window.addHomework = async () => {
  try {
    let title = document.querySelector(
      ".add-homework__content .titlu-tema"
    )?.value;
    console.log("titlu " + title);
    let problemsIds = [];
    let i = 0;
    const problemsList = document.querySelectorAll("#problems-list tr");
    problemsList.forEach((problem) => {
      if (problem.classList.contains("checked")) {
        problemsIds[i] = problem.dataset.id;
        i++;
      }
    });

    const data = await Fetch.create("/homework", {
      name: title,
      id_class: searchParams.get("id"),
      problemIds: problemsIds,
    });
    console.log(data);
    if (data.statusCode != 201) {
      if (!data.errors?.length || data.errors?.length === 0) {
        errElement.textContent = data?.message || "Date invalide";
      } else if (data?.errors?.length) {
        errElement.textContent = data.errors[0].msg;
      }
    } else {
      window.location.href = `${rootPath}/class.html?id=${searchParams.get(
        "id"
      )}`;
    }
  } catch (e) {
    console.log(e);
  }
};
if (searchParams.has("id")) {
  getProblems();
  getPendingProblems();
} else {
  window.location.href = `${rootPath}/classes.html`;
}
