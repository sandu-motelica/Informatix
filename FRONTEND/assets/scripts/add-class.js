import Fetch from "../../utils/Fetch.js";
const errElement = document?.querySelector(".error");

window.addClass = async () => {
  try {
    let name = document.querySelector('#class-form input[type="text"]')?.value;
    const data = await Fetch.create("/class", {
      name,
    });

    if (data.statusCode != 201) {
      if (!data.errors?.length || data.errors?.length === 0) {
        errElement.textContent = data?.message || "Date invalide";
      } else if (data?.errors?.length) {
        errElement.textContent = data.errors[0].msg;
      }
    } else {
      window.location.href = `/FRONTEND/pages/class.html?id=${data?.id}`;
    }
  } catch (e) {
    console.log(e);
  }
};
