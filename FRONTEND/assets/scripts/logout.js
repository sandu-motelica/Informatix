import Fetch from "../../utils/Fetch.js";
import unauthorizedRedirect from "./unauthorized.js";

export const logout = async () => {
  const data = await Fetch.create("/user/logout");
  if (data.statusCode === 200) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    unauthorizedRedirect();
  }
};
