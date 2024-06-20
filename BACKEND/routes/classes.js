import {
  addMember,
  createClass,
  getClasses,
  deleteClass,
} from "../controllers/classController.js";
import { router } from "./index.js";

const DEFAULT_PATH = "/class";

router.on("GET", `${DEFAULT_PATH}`, getClasses);
router.on("POST", `${DEFAULT_PATH}`, createClass);
router.on("POST", `${DEFAULT_PATH}/member`, addMember);
router.on("DELETE", `${DEFAULT_PATH}`, deleteClass);

export default router;
