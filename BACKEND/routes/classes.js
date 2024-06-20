import {
  addMember,
  createClass,
  getClasses,
} from "../controllers/classController.js";
import { router } from "./index.js";

const DEFAULT_PATH = "/class";

router.on("GET", `${DEFAULT_PATH}`, getClasses);
router.on("POST", `${DEFAULT_PATH}`, createClass);
router.on("POST", `${DEFAULT_PATH}/member`, addMember);

export default router;
