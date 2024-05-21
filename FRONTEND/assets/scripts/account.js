import unauthorizedRedirect from "./unauthorized.js";
import Fetch from "../../utils/Fetch.js";
unauthorizedRedirect();

const searchParams = new URLSearchParams(window.location.search);
const id = searchParams.get("id");

const getUserInfo = async () => {
  const data = await Fetch.get("/user/info");
  if (data?.statusCode === 200) {
    try {
      const { user, solutions } = data;
      const name = document.querySelector(".account__info__name");
      name.textContent = user.username;
      const solutionNumber = document.querySelectorAll(
        ".account__statistic__solutions"
      );
      for (let i = 0; i < solutionNumber.length; i++) {
        let diff;
        if (i === 0) diff = "easy";
        else if (i === 1) diff = "medium";
        else diff = "hard";
        const count = solutions.filter((sol) => sol.difficulty === diff).length;
        solutionNumber[i].textContent = count;
      }
    } catch (e) {
      console.log(e);
    }
  }
};

getUserInfo();

const getSolution = async () => {
  const data = await Fetch.get("/problem/difficulty");
  if (data?.statusCode === 200) {
    console.log(data);
    try {
      // const { count } = data;
      // const name = document.querySelector(".account__info__name");
      // console.log(name);
      // name.textContent = username;
    } catch (e) {
      console.log(e);
    }
  }
};

getSolution();
