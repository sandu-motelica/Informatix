import { getUsers, userLogin, userLogout, userRefresh, userRegister } from "../controllers/userController.js";
import { router } from "./index.js";

const DEFAULT_PATH = '/user';

router.on('GET', `${DEFAULT_PATH}`, getUsers);
router.on('POST', `${DEFAULT_PATH}/register`, userRegister);
router.on('POST', `${DEFAULT_PATH}/login`, userLogin);
router.on('POST', `${DEFAULT_PATH}/logout`, userLogout);
router.on('POST', `${DEFAULT_PATH}/refresh`, userRefresh);

export default router;
