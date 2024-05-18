import {
  addProblem,
  removeProblem,
  getProblems,
} from "../controllers/problemController.js";
import { router } from "./index.js";

const DEFAULT_PATH = "/problem";

router.on("GET", `${DEFAULT_PATH}`, getProblems);
router.on("POST", `${DEFAULT_PATH}/add`, addProblem);
router.on("POST", `${DEFAULT_PATH}/remove`, removeProblem);

export default router;
