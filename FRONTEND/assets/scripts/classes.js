import Fetch from "../../utils/Fetch.js";
import unauthorizedRedirect from "./unauthorized.js";
unauthorizedRedirect();

const user = JSON.parse(localStorage.getItem("user"));
const classContainer = document.querySelector(".class-container");

if (user.role === "teacher") {
  const createBtn = `
  <a class="btn btn-primary btn-create-class" href="/FRONTEND/pages/add-class.html">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="add-class-icon"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
    Creeaza clasa
  </a>
`;
  classContainer.innerHTML += createBtn;
}

const getClasses = async () => {
  const data = await Fetch.get("/class");
  if (data?.statusCode === 200) {
    console.log(data);
    try {
      const classes = data;

      if (classes.length === 0 && user.role != "teacher") {
        const defaultMess = document.createElement("p");
        defaultMess.classList.add("default-message");
        defaultMess.textContent = "Nu esti membru la nicio clasa";
        classContainer.after(defaultMess);
      }
      classes.forEach((item) => {
        const classLink = document.createElement("a");
        classLink.href = `/FRONTEND/pages/class.html?id=${item._id}`;
        classLink.classList.add("class-link");
        classLink.textContent = item.name;
        classContainer.appendChild(classLink);
      });
    } catch (e) {
      console.log(e);
    }
  }
};

getClasses();
