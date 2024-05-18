import unauthorizedRedirect from "./unauthorized.js";
import Fetch from "../../utils/Fetch.js";
unauthorizedRedirect();

const searchParams = new URLSearchParams(window.location.search);
const id = searchParams.get("id");

const getUser = async () => {
  const data = await Fetch.get("/user/info");
  if (data?.statusCode === 200) {
    console.log(data);
    try {
      const { username } = data;
      const name = document.querySelector(".account__info__name");
      console.log(name);
      name.textContent = username;
    } catch (e) {
      console.log(e);
    }
  }
};

getUser();
