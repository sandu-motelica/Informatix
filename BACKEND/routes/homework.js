import {
  createHomework,
  deleteHomework,
  getHomeworks,
} from "../controllers/HomeworkController.js";
import { router } from "./index.js";

const DEFAULT_PATH = "/homework";

router.on("GET", `${DEFAULT_PATH}`, getHomeworks);
router.on("POST", `${DEFAULT_PATH}`, createHomework);
router.on("DELETE", `${DEFAULT_PATH}`, deleteHomework);

export default router;
