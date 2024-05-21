import {
  addProblem,
  removeProblem,
  getProblems,
  getNumberOfProbWithDiff,
} from "../controllers/problemController.js";
import { router } from "./index.js";

const DEFAULT_PATH = "/problem";

router.on("GET", `${DEFAULT_PATH}`, getProblems);
router.on("POST", `${DEFAULT_PATH}/`, addProblem);
router.on("DELETE", `${DEFAULT_PATH}/`, removeProblem);
router.on("GET", `${DEFAULT_PATH}/difficulty`, getNumberOfProbWithDiff);

export default router;
