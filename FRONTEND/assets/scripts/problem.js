import { rootPath } from "./constants.js";
import Fetch from "../../utils/Fetch.js";
const deleteQst = document.querySelector(".popup-delete__qst");
const errEl = document.querySelector(".error");

const searchParams = new URLSearchParams(window.location.search);

let problem = {};

if (!searchParams.get("solution")) {
  document.querySelector(".problem__marks").style.display = "none";
}

const user = JSON.parse(localStorage.getItem("user"));
if (user.role != "student") {
  document.querySelector(".problem__submit").style.display = "none";
} else {
  document.querySelector(".problem__marks").style.display = "none";
}

const getSolution = async () => {
  try {
    const data = await Fetch.get("/solution", {
      _id: searchParams.get("solution"),
    });
    if (data.solutions?.length) {
      const solution = data.solutions[0];
      const textArea = document.querySelector("textarea");
      textArea.value = solution.content;
      textArea.disabled = true;
      if (solution.grade) {
        const grades = document.querySelectorAll(".problem__marks button");
        document.querySelector(".problem__marks").style.display = "flex";
        grades.forEach((grade) => {
          if (solution.grade != grade.getAttribute("data-value")) {
            grade.disabled = true;
          } else {
            grade.style.pointerEvents = "none";
          }
        });
      }
    } else {
      window.location.href = `${rootPath}/problem.html?id=${searchParams.get(
        "id"
      )}`;
    }
  } catch (e) {
    console.log(e);
  }
};

if (searchParams.get("solution")) {
  document.querySelector(".problem__submit").style.display = "none";
  getSolution();
}

const getProblem = async () => {
  try {
    const data = await Fetch.get("/problem", {
      _id: searchParams.get("id"),
    });
    if (data.problems?.length) {
      problem = data.problems[0];
      const tagsBlock = document.querySelector(".problems__tags-wrapper");
      if (!tagsBlock.lastElementChild) {
        problem?.tags.forEach((item) => {
          const btn = document.createElement("button");
          btn.innerHTML = item;
          tagsBlock.appendChild(btn);
        });
      }

      if (
        (problem.id_author.toString() === user.id.toString() ||
          user.role === "admin") &&
        !searchParams.get("solution")
      )
        document.querySelector(".delete-btn").style.display = "flex";

      document.querySelector(".problem__title").textContent = problem.title;
      document.querySelector(".problem__content-text").textContent =
        problem.description;
      document.querySelector(".problem__difficulty").textContent =
        mapDifficulty(problem.difficulty);
      document.querySelector(
        ".problem__accepted"
      ).innerHTML = `Acceptate: <strong>${problem.accepted}</strong>`;
      document.querySelector(
        ".problem__submitted"
      ).innerHTML = `Trimise: <strong>${problem.submissions}</strong>`;

      const starEl = document.querySelectorAll(".rating-star-icon");

      for (let i = 0; i < Math.round(problem.rating); i++)
        starEl[i]?.classList.add("rating-star-selected");

      for (let i = Math.round(problem.rating); i < starEl.length; i++)
        starEl[i]?.classList.remove("rating-star-selected");

      document.getElementById("problem-rating").textContent =
        problem.rating.toFixed(1);
      deleteQst.textContent = `Confirmi ștergerea probleme "${problem.title}"?`;
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

window.sendSolution = async () => {
  try {
    if (searchParams.get("homework")) {
      const content = document.getElementById("solution").value;
      const data = await Fetch.create("/solution", {
        id_problem: searchParams.get("id"),
        id_homework: searchParams.get("homework"),
        content,
      });
      if (data.statusCode >= 400) {
        errEl.textContent = data.message;
        return;
      }
      window.location.href = `${rootPath}/homework.html?id=${searchParams.get(
        "homework"
      )}`;
    } else {
      const content = document.getElementById("solution").value;
      const data = await Fetch.create("/solution", {
        id_problem: searchParams.get("id"),
        content,
      });
      if (data.statusCode >= 400) {
        errEl.textContent = data.message;
        return;
      }
      window.location.href = window.location.href + `&solution=${data.id}`;
    }
  } catch (e) {
    console.log(e);
  }
};

window.exportProblem = () => {
  const blob = new Blob([JSON.stringify(problem)], { type: "text/json" });
  const link = document.createElement("a");

  link.download = problem.title + ".json";
  link.href = window.URL.createObjectURL(blob);
  link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

  const evt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  link.dispatchEvent(evt);
  link.remove();
};

const evaluateSolution = async (grade) => {
  try {
    await Fetch.update("/solution", {
      id: searchParams.get("solution"),
      grade,
    });
    getSolution();
    // }
  } catch (e) {
    console.log(e);
  }
};

const rateProblem = async (rate) => {
  try {
    const data = await Fetch.create("/problem/rate", {
      id_problem: searchParams.get("id"),
      rate,
    });
    if (data.statusCode != 200) {
      errEl.textContent = "Problem was already rated";
      return;
    }
    getProblem();
  } catch (e) {
    console.log(e);
  }
};

window.init = () => {
  const grades = document.querySelectorAll(".problem__marks button");
  grades.forEach((grade) => {
    grade.addEventListener("click", () =>
      evaluateSolution(grade.getAttribute("data-value"))
    );
  });

  const buttonsRate = document.querySelectorAll(".problem__evaluate li");
  buttonsRate.forEach((rating) => {
    rating.addEventListener("click", () =>
      rateProblem(rating.getAttribute("data-value"))
    );
  });
};

const getComments = async () => {
  try {
    const data = await Fetch.get("/comment", {
      problemId: searchParams.get("id"),
    });
    document.getElementById("comments-number").innerHTML = `(${
      data?.length || 0
    })`;
    data.forEach((item) => {
      let li = document.createElement("li");
      li.innerHTML = `
    <p class="discussion-section__author" style="color:${
      item.id_user.role === "teacher" ? "#fea116" : "#fff"
    }">@${item.id_user.username}</p>
    </p>
    <p class="discussion-section__description">${item.content}</p>
    <p class="discussion-section__date">${new Date(
      item.created_time
    ).toLocaleDateString()}</p>
  `;
      document.querySelector(".discussion-section__list").appendChild(li);
    });
  } catch (e) {
    console.log(e);
  }
};

window.addComment = async () => {
  try {
    const description = document.getElementById("comment-description").value;
    const problemId = searchParams.get("id");
    await Fetch.create("/comment", {
      content: description,
      problemId,
    });
    const comments = document.querySelector(".discussion-section__list");
    while (comments.lastElementChild) {
      comments.removeChild(comments.lastElementChild);
    }
    document.getElementById("comment-description").value = "";
    await getComments();
  } catch (e) {
    console.log(e);
  }
};

const popup = document.querySelector(".popup-delete");
document.querySelector(".delete-btn").addEventListener("click", function () {
  popup.style.display = "flex";
});

const closeBtns = document.querySelectorAll(".popup-delete__close");
closeBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    popup.style.display = "none";
  });
});

window.removeProblem = async () => {
  try {
    const data = await Fetch.remove("/problem", {
      problemId: searchParams.get("id"),
    });
    if (data.statusCode != 200) {
      if (!data.errors?.length || data.errors?.length === 0) {
        errEl.textContent = data?.message || "User inexistent";
      } else if (data?.errors?.length) {
        errEl.textContent = data.errors[0].msg;
      }
    } else {
      window.location.href = `${rootPath}/problems.html`;
    }
  } catch (e) {
    console.log(e);
  }
};

const mapDifficulty = (difficulty) => {
  switch (difficulty) {
    case "easy":
      return "Ușor";

    case "medium":
      return "Mediu";
    case "hard":
      return "Dificil";

    default:
      return "";
  }
};

getComments();
