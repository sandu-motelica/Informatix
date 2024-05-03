export default () => {
  if (!localStorage.getItem("token"))
    window.location.href = "/FRONTEND/pages/index.html";
};
