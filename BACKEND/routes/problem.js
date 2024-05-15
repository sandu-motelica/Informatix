import {
  addProblem,
  getProblems,
  getTags,
  getProblemTag,
} from "../controllers/problemController.js";
import { router } from "./index.js";

const DEFAULT_PATH = "/problem";

router.on("GET", `${DEFAULT_PATH}`, getProblems);
router.on("POST", `${DEFAULT_PATH}/add`, addProblem);
router.on("GET", `${DEFAULT_PATH}/tags`, getTags);
router.on("GET", `${DEFAULT_PATH}/tagproblem`, getProblemTag);

export default router;
