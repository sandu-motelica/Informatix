import {
  getSolutions,
  addSolution,
} from "../controllers/SolutionController.js";
import { router } from "./index.js";

const DEFAULT_PATH = "/solution";

router.on("GET", `${DEFAULT_PATH}`, getSolutions);
router.on("POST", `${DEFAULT_PATH}/add`, addSolution);

export default router;
