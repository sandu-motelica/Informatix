import unauthorizedRedirect from "./unauthorized.js";
import Fetch from "../../utils/Fetch.js";
import { rootPath } from "./constants.js";

const searchParams = new URLSearchParams(window.location.search);

unauthorizedRedirect();

const addedProblems = new Set();

const errElement = document?.querySelector(".error");

const problemsList = document.getElementById("problems-list");
const pendingProblemsList = document.querySelector(".pending-problems");

const deleteProblemBtn = `<button class="btn delete-problem" type="button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="delete-problem__icon"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>`;

document.querySelector(
  ".btn-add-problem"
).href = `${rootPath}/add-problem.html?homework=${searchParams.get("id")}`;

window.searchProblem = (event) => {
  if (event.key === "Enter") {
    const problemsList = document.getElementById("problems-list");
    while (problemsList.lastElementChild) {
      problemsList.removeChild(problemsList.lastElementChild);
    }
    getProblems();
  }
};

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
        if (addedProblems.has(item?.id)) tr.classList.add("checked");
        tr.innerHTML = `
          <th >
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
          <th class="problem-name"><a class="problem-link" href="${rootPath}/problem.html?id=${item?.id}">${item?.title}</a></th>
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

  if (data?.statusCode === 200) {
    try {
      const { problems } = data;
      if (problems.length > 0) {
        document.querySelector(".pending-problems-header").style.display =
          "block";
      }
      problems.forEach((item) => {
        const el = document.createElement("li");
        el.classList.add("pending-pr");
        el.setAttribute("data-id", item?.id_problem);
        const titlu = document.createElement("a");
        titlu.textContent = item.title;
        titlu.href = `${rootPath}/problem.html?id=${item?.id_problem}`;
        const inf = document.createElement("div");
        inf.classList.add("pending-problems-info");
        const infText = document.createElement("span");
        infText.textContent = "pending";
        inf.innerHTML += deleteProblemBtn;
        inf.appendChild(infText);
        el.appendChild(titlu);
        el.appendChild(inf);
        pendingProblemsList.appendChild(el);
      });
      attachDeleteEvents();
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
      const id = line.getAttribute("data-id").toString();
      if (addedProblems.has(id)) addedProblems.delete(id);
      else addedProblems.add(id);
    });
  });
};

window.addHomework = async () => {
  try {
    let title = document.querySelector(
      ".add-homework__content .titlu-tema"
    )?.value;
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

const attachDeleteEvents = () => {
  const pendingProblems = document.querySelectorAll(".pending-pr");
  const deleteButtons = document.querySelectorAll(".delete-problem");
  deleteButtons.forEach((btn, i) => {
    btn.addEventListener("click", async () => {
      try {
        const problemId = pendingProblems[i].dataset.id;

        const data = await Fetch.remove("/problem/pending", {
          problemId,
        });
        if (data.statusCode != 200) {
          if (!data.errors?.length || data.errors?.length === 0) {
            errElement.textContent = data?.message || "Eroare la stergere";
          } else if (data?.errors?.length) {
            errElement.textContent = data.errors[0].msg;
          }
        } else {
          console.log(data);
          pendingProblemsList.removeChild(pendingProblems[i]);
        }
      } catch (e) {
        console.log(e);
      }
    });
  });
};

if (searchParams.has("id")) {
  getProblems();
  getPendingProblems();
} else {
  window.location.href = `${rootPath}/classes.html`;
}
