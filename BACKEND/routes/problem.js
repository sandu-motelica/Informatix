import {
  addProblem,
  removeProblem,
  getProblems,
  getNumberOfProbWithDiff,
  updateProblem,
  rateProblem,
  getPendingProblems,
} from "../controllers/problemController.js";
import { router } from "./index.js";

const DEFAULT_PATH = "/problem";

router.on("GET", `${DEFAULT_PATH}`, getProblems);
router.on("GET", `${DEFAULT_PATH}/pending`, getPendingProblems);
router.on("POST", `${DEFAULT_PATH}`, addProblem);
router.on("POST", `${DEFAULT_PATH}/rate`, rateProblem);
router.on("DELETE", `${DEFAULT_PATH}`, removeProblem);
// router.on("DELETE", `${DEFAULT_PATH}/`, removeProblem);
router.on("PUT", `${DEFAULT_PATH}`, updateProblem);
router.on("GET", `${DEFAULT_PATH}/difficulty`, getNumberOfProbWithDiff);

export default router;
