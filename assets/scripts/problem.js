import { rootPath } from "./constants.js";
const searchParams = new URLSearchParams(window.location.search);
const problemHeadline = document.getElementsByClassName("problem__title")[0];

if (searchParams.has("id")) {
  // problemHeadline.append(searchParams.get('id'))
} else window.location.href = `${rootPath}/problems.html`;
