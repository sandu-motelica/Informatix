import { Solution } from "../models/solutionModel.js";
import { Problem } from "../models/problemModel.js";
import { User } from "../models/userModel.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";
import SolutionDto from "../dtos/SolutionDto.js";

export const getSolutions = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const solutions = await Solution.find({});
    res.statusCode = 200;
    res.end(JSON.stringify(solutions));
  } catch (e) {
    errorMiddleware(res, e);
  }
};

export const addSolution = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const body = JSON.parse(req.data);
    const { id_problem, content } = body;

    if (content.length < 5)
      throw ApiError.BadRequest("Invalid solution (min 5 characters)");
    const userId = req.user.payload.id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw ApiError.BadRequest("User does not exist");
    }

    const solution = await Solution.create({
      id_problem,
      id_student: userId,
      content,
    });

    res.statusCode = 201;
    res.end(JSON.stringify(new SolutionDto(solution)));
  } catch (e) {
    errorMiddleware(res, e);
  }
};
export const getSolutionsWithDiff = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const body = JSON.parse(req.data);
    const { difficulty } = body;
    const userId = req.user.payload.id;

    const problems = await Problem.find({ difficulty }).lean();

    const problemIds = problems.map((problem) => problem._id);

    const solutions = await Solution.find({
      id_student: userId,
      id_problem: { $in: problemIds },
    }).lean();

    res.statusCode = 200;
    res.end(JSON.stringify({ count: solutions.length }));
  } catch (e) {
    errorMiddleware(res, e);
  }
};
