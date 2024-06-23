import Fetch from "../../utils/Fetch.js";
import unauthorized from "./unauthorized.js";
const searchParams = new URLSearchParams(window.location.search);
import { rootPath } from "./constants.js";

const tags = document.getElementsByClassName("tag");
const choiceTagsList = document.getElementById("choice-tags-list");
const errElement = document?.querySelector(".add-problem-wrapper .error");

const userRole = JSON.parse(localStorage.getItem("user"))?.role;
if (userRole != "teacher") window.location.href = `${rootPath}/index.html`;

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

  const localTags = document.getElementsByClassName("tag");
  console.log(localTags);
  const visibleTagsLength = Array.from(localTags)?.filter(
    (item) => item.style.display === "flex"
  );
  if (visibleTagsLength.length === 0) {
    try {
      document.getElementsByClassName(
        "problems__empty-categories"
      )[0].style.display = "block";
    } catch (e) {
      console.log(e);
    }
  }
};

function generateTagsButtons(categories) {
  const wrapper = document.getElementById("tags-list");

  wrapper.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.classList.add("tag");
    button.setAttribute("data-name", category.name);

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
    });
    wrapper.appendChild(button);
  });
}

// valori temporare
// generateTagsButtons([
//   { name: "Divizibilitate", count: 120 },
//   { name: "Primalitate", count: 22 },
//   { name: "Tablouri unidimensionale", count: 11 },
//   { name: "Tablouri bidimensionale", count: 1120 },
//   { name: "Olimpiada", count: 129990 },
// ]);

const resetForm = () => {
  errElement.textContent = "";
  document.getElementById("problem-form").reset();
  while (choiceTagsList.firstChild) {
    choiceTagsList.removeChild(choiceTagsList.firstChild);
  }
  //TODO: Updated with db tags
  getTags();

  document.getElementById("easy").checked = true;
};

window.addCategory = async () => {
  alert("Adaugam categoria in db...");
  try {
    const name = document
      .querySelector(".problems__tags")
      .querySelector("input").value;
    const data = await Fetch.create("/tag", {
      name,
    });
    await getTags();
    document.querySelector(".problems__tags").querySelector("input").value = "";
    Array.from(tags).forEach((item) => {
      item.style.display = "flex";
    });
    document.getElementsByClassName(
      "problems__empty-categories"
    )[0].style.display = "none";
  } catch (e) {
    console.log(e);
  }
};

window.addProblem = async () => {
  try {
    let title = document.querySelector(
      '.add-problems__content input[type="text"]'
    )?.value;
    let description = document.querySelector(
      ".add-problems__content textarea"
    )?.value;

    const difficultyDiv = document.querySelector(".add-problems__difficulty");
    const difficultyRadioButtons = difficultyDiv.querySelectorAll(
      'input[type="radio"]'
    );
    let difficulty = null;
    difficultyRadioButtons.forEach((radioButton) => {
      if (radioButton.checked) {
        difficulty = radioButton.value;
      }
    });

    const tagsWrapper = document.getElementById("choice-tags-list");
    const tags = tagsWrapper.querySelectorAll(".tag");
    let tagNames = [];
    tags.forEach((tag) => {
      tagNames.push(tag.getAttribute("data-name"));
    });
    let data;
    if (searchParams.get("homework")) {
      data = await Fetch.create("/problem", {
        title,
        description,
        difficulty,
        tagNames,
        homework: true,
      });
    } else {
      data = await Fetch.create("/problem", {
        title,
        description,
        difficulty,
        tagNames,
      });
    }

    if (data.statusCode != 201) {
      if (!data.errors?.length || data.errors?.length === 0) {
        errElement.textContent = data?.message || "Date invalide";
      } else if (data?.errors?.length) {
        errElement.textContent = data.errors[0].msg;
      }
    } else {
      if (searchParams.get("homework")) {
        window.location.href = `${rootPath}/add-homework.html?id=${searchParams.get(
          "homework"
        )}`;
      } else {
        alert("Problema a fost adăugată cu succes!");
        resetForm();
      }
    }
  } catch (e) {
    console.log(e);
  }
};

const getTags = async () => {
  const data = await Fetch.get("/tag");
  return generateTagsButtons(
    data.map((item) => ({ name: item.name, count: item.count }))
  );
};

getTags();

window.init = () => {
  document
    .getElementById("import-file")
    .addEventListener("change", handleFileSelect, false);
};

function handleFileSelect(event) {
  const reader = new FileReader();
  reader.onload = handleFileLoad;
  reader.readAsText(event.target.files[0]);
}

function handleFileLoad(event) {
  try {
    // document.getElementById("fileContent").textContent = event.target.result;
    const { title, description, tags, difficulty } = JSON.parse(
      event.target.result
    );
    if (!title || !description || !difficulty || !tags || tags.length == 0) {
      alert("Fisier JSON incorect");
      return;
    }
    document.querySelector('.add-problems__content input[type="text"]').value =
      title;
    document.querySelector(".add-problems__content textarea").value =
      description;
    const difficultyDiv = document.querySelector(".add-problems__difficulty");
    const difficultyRadioButtons = difficultyDiv.querySelectorAll(
      'input[type="radio"]'
    );
    difficultyRadioButtons.forEach((radioButton) => {
      if (radioButton.value === difficulty) {
        radioButton.checked = true;
      }
    });
    const tagsWrapper = document.getElementById("tags-list");
    const tagsElements = tagsWrapper.querySelectorAll(".tag");

    tagsElements.forEach((tag) => {
      if (tags.includes(tag.getAttribute("data-name"))) tag.click();
    });
  } catch (e) {
    console.log(e);
  }
}
