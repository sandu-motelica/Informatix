import errorMiddleware from "../middlewares/errorMiddleware.js";
import { Comment } from "../models/commentModel.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import queryParams from "../utils/queryParams.js";

export const getComments = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const { problemId } = queryParams(req);
    const data = await Comment.find({ id_problem: problemId }).populate(
      "id_user",
      "username role"
    );
    res.statusCode = 200;
    res.end(JSON.stringify(data.reverse()));
  } catch (e) {
    errorMiddleware(res, e);
  }
};

export const addComment = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const userId = req.user.payload.id;
    const body = JSON.parse(req.data);
    const { title, content, problemId } = body;
    const data = await Comment.create({
      title,
      content,
      id_user: userId,
      id_problem: problemId,
    });
    res.statusCode = 200;
    res.end(JSON.stringify(data));
  } catch (e) {
    errorMiddleware(res, e);
  }
};
