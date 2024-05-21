import {
  getSolutions,
  addSolution,
  getSolutionsWithDiff,
  getNumberOfSolutionProblem,
} from "../controllers/SolutionController.js";
import { router } from "./index.js";

const DEFAULT_PATH = "/solution";

router.on("GET", `${DEFAULT_PATH}`, getSolutions);
router.on("POST", `${DEFAULT_PATH}`, addSolution);
router.on("GET", `${DEFAULT_PATH}/difficulty`, getSolutionsWithDiff);
router.on("GET", `${DEFAULT_PATH}/problem`, getNumberOfSolutionProblem);

export default router;
