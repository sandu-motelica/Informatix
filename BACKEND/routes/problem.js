import {
  addProblem,
  removeProblem,
  getProblems,
  getNumberOfProbWithDiff,
  updateProblem,
  rateProblem,
  getPendingProblems,
  removePendingProblems,
  getPublicProblems,
  getCountProblems,
  getProfesorProblem,
} from "../controllers/ProblemController.js";
import { router } from "./index.js";

const DEFAULT_PATH = "/problem";

router.on("GET", `${DEFAULT_PATH}`, getProblems);
router.on("GET", `${DEFAULT_PATH}/pending`, getPendingProblems);
router.on("GET", `${DEFAULT_PATH}/counter`, getCountProblems);
router.on("GET", `${DEFAULT_PATH}/profesor`, getProfesorProblem);
router.on("POST", `${DEFAULT_PATH}`, addProblem);
router.on("POST", `${DEFAULT_PATH}/rate`, rateProblem);
router.on("DELETE", `${DEFAULT_PATH}/pending`, removePendingProblems);
router.on("DELETE", `${DEFAULT_PATH}`, removeProblem);
router.on("PUT", `${DEFAULT_PATH}`, updateProblem);
router.on("GET", `${DEFAULT_PATH}/difficulty`, getNumberOfProbWithDiff);
router.on("GET", `${DEFAULT_PATH}/public`, getPublicProblems);

export default router;
