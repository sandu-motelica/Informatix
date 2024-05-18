import Fetch from "../../utils/Fetch.js";

const tags = document.getElementsByClassName("tag");

const searchTag = (event) => {
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
      const choiceTagsList = document.getElementById("choice-tags-list");
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
generateTagsButtons([
  { name: "Divizibilitate", count: 120 },
  { name: "Primalitate", count: 22 },
  { name: "Tablouri unidimensionale", count: 11 },
  { name: "Tablouri bidimensionale", count: 1120 },
  { name: "Olimpiada", count: 129990 },
]);

const addCategory = () => {
  alert("Adaugam categoria in db...");
  try {
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
  let title = document.querySelector(
    '.add-problems__content input[type="text"]'
  )?.value;
  let description = document.querySelector(
    ".add-problems__content textarea"
  )?.value;
  console.log("titlu " + title);
  console.log("conditie " + description);

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
  console.log("dificultate " + difficulty);

  const tagsWrapper = document.getElementById("choice-tags-list");
  const tags = tagsWrapper.querySelectorAll(".tag");
  let tagNames = [];
  tags.forEach((tag) => {
    tagNames.push(tag.getAttribute("data-name"));
  });
  console.log("taguri " + tagNames);
  const id_author = "663357bbc20d6a0dfb6c4931";
  const data = await Fetch.create("/problem/add", {
    id_author,
    title,
    description,
    difficulty,
    tagNames,
  });

  if (data.statusCode != 201) {
    console.log(data);
    const errElement = document?.querySelector(".add-problem-wrapper .error");
    if (errElement && data.errors.length === 0) {
      errElement.textContent = data?.message || "Date invalide";
    } else {
      if (data.errors.length) {
        errElement.textContent = data.errors[0].msg;
      } else {
        errElement.textContent = "";
      }
    }
  } else {
    alert("Problema a fost adăugată cu succes!");
  }
};
