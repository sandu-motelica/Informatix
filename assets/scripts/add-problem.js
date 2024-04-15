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
