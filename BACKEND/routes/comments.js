import { addComment, getComments } from "../controllers/CommentController.js";
import { router } from "./index.js";

const DEFAULT_PATH = "/comment";

router.on("GET", `${DEFAULT_PATH}`, getComments);
router.on("POST", `${DEFAULT_PATH}`, addComment);

export default router;
