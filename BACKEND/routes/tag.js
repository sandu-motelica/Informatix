import { router } from "./index.js";
import { getTags } from "../controllers/tagController.js";

const DEFAULT_PATH = "/tag";

router.on("GET", `${DEFAULT_PATH}`, getTags);
// router.on('POST', `${DEFAULT_PATH}/register`, userRegister);
// router.on('POST', `${DEFAULT_PATH}/login`, userLogin);
// router.on('POST', `${DEFAULT_PATH}/logout`, userLogout);
// router.on('POST', `${DEFAULT_PATH}/refresh`, userRefresh);

export default router;
