import {
  getTags,
  getProblemTag,
  addTag,
} from "../controllers/TagController.js";
import { router } from "./index.js";

const DEFAULT_PATH = "/tag";

router.on("GET", `${DEFAULT_PATH}`, getTags);
router.on("POST", `${DEFAULT_PATH}`, addTag);
router.on("GET", `${DEFAULT_PATH}/tag-problem`, getProblemTag);

export default router;
