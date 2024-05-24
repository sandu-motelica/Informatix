import { Solution, solutionSchema } from "../models/solutionModel.js";
import { Problem } from "../models/problemModel.js";
import { User } from "../models/userModel.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";
import SolutionDto from "../dtos/SolutionDto.js";
import queryParams from "../utils/queryParams.js";

export const getSolutions = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const data = queryParams(req);

    const solutionsFilter = {};
    Object.keys(solutionSchema.paths).forEach((key) => {
      if (data[key]) solutionsFilter[key] = data[key];
    });

    const solutions = await Solution.find(solutionsFilter);
    res.statusCode = 200;
    res.end(JSON.stringify({ solutions: solutions }));
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
    const problem = await Problem.findOne({ _id: id_problem });
    if (!user) {
      throw ApiError.BadRequest("Problem does not exist");
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

export const getNumberOfSolutionProblem = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const body = JSON.parse(req.data);
    const { id_problem } = body;

    const solutions = await Solution.find({
      id_problem,
    }).lean();

    res.statusCode = 200;
    res.end(JSON.stringify({ count: solutions.length }));
  } catch (e) {
    errorMiddleware(res, e);
  }
};
export const getNumberOfResolvedProblem = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const body = JSON.parse(req.data);
    const { id_problem } = body;

    const solutions = await Solution.find({
      id_problem,
      grade: { $gte: 8 },
    }).lean();

    res.statusCode = 200;
    res.end(JSON.stringify({ count: solutions.length }));
  } catch (e) {
    errorMiddleware(res, e);
  }
};
