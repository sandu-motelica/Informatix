import { createClass, getClasses } from "../controllers/classController.js";
import { router } from "./index.js";

const DEFAULT_PATH = "/class";

router.on("GET", `${DEFAULT_PATH}`, getClasses);
router.on("POST", `${DEFAULT_PATH}`, createClass);
// router.on("DELETE", `${DEFAULT_PATH}/`, removeProblem);
// router.on("GET", `${DEFAULT_PATH}/difficulty`, getNumberOfProbWithDiff);

export default router;
