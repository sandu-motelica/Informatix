import ApiError from "../exceptions/apiError.js";
import { validateAccessToken } from "../utils/token.js";

export default async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw ApiError.UnauthorizedError();
    }

    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = await validateAccessToken(accessToken);
    // console.log(userData)
    if (!userData) {
      throw ApiError.UnauthorizedError();
    }
    req.user = userData;
  } catch (e) {
    console.log(e);
    throw ApiError.UnauthorizedError();
  }
};
