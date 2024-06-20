import {
  getSolutions,
  addSolution,
  getSolutionsWithDiff,
  getNumberOfSolutionProblem,
  getNumberOfResolvedProblem,
  evaluateSolution,
} from "../controllers/SolutionController.js";
import { router } from "./index.js";

const DEFAULT_PATH = "/solution";

router.on("GET", `${DEFAULT_PATH}`, getSolutions);
router.on("POST", `${DEFAULT_PATH}`, addSolution);
router.on("PUT", `${DEFAULT_PATH}`, evaluateSolution);
router.on("GET", `${DEFAULT_PATH}/difficulty`, getSolutionsWithDiff);
router.on("GET", `${DEFAULT_PATH}/sended`, getNumberOfSolutionProblem);
router.on("GET", `${DEFAULT_PATH}/solved`, getNumberOfResolvedProblem);

export default router;
