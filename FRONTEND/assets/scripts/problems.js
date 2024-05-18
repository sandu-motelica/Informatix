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
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");
    // unauthorizedRedirect();
    console.log(data);
  }
};

getProblems();
