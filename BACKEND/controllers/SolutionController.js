import { Solution, solutionSchema } from "../models/solutionModel.js";
import { Problem } from "../models/problemModel.js";
import { User } from "../models/userModel.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";
import SolutionDto from "../dtos/SolutionDto.js";
import queryParams from "../utils/queryParams.js";
import ApiError from "../exceptions/apiError.js";
import { HomeworkProblems } from "../models/homeworkProblemsModel.js";

export const getSolutions = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const data = queryParams(req);
    const userId = req.user.payload.id;

    const user = await User.findOne({ _id: userId }).lean();
    if (!user) {
      throw ApiError.BadRequest("User does not exist");
    }

    let solutions;

    if (data.id_homework) {
      if (user.role === "student") {
        solutions = await Solution.find({
          id_homework: data.id_homework,
          id_student: userId,
        }).lean();

        const problemIds = solutions.map((solution) => solution.id_problem);
        const problems = await Problem.find({
          _id: { $in: problemIds },
        }).lean();

        const problemNameMap = problems.reduce((acc, problem) => {
          acc[problem._id] = problem.title;
          return acc;
        }, {});
        // console.log(problemNameMap);
        solutions = solutions.map((solution) => {
          return {
            ...new SolutionDto(solution),
            problemName: problemNameMap[solution.id_problem] || "Unknown",
          };
        });
        // console.log(solutions);
      } else if (user.role === "teacher") {
        solutions = await Solution.find({
          id_homework: data.id_homework,
        }).lean();

        const problemIds = solutions.map((solution) => solution.id_problem);
        const problems = await Problem.find({
          _id: { $in: problemIds },
        }).lean();

        const problemNameMap = problems.reduce((acc, problem) => {
          acc[problem._id] = problem.title;
          return acc;
        }, {});

        const studentIds = solutions.map((solution) => solution.id_student);
        const students = await User.find({
          _id: { $in: studentIds },
        }).lean();

        const studentNameMap = students.reduce((acc, student) => {
          acc[student._id] = student.username;
          return acc;
        }, {});

        solutions = solutions.map((solution) => ({
          ...new SolutionDto(solution),
          problemName: problemNameMap[solution.id_problem] || "Unknown",
          studentName: studentNameMap[solution.id_student] || "Unknown",
        }));

        solutions.sort((a, b) => a.studentName.localeCompare(b.studentName));
      }
    } else {
      const solutionsFilter = {};
      Object.keys(solutionSchema.paths).forEach((key) => {
        if (data[key]) solutionsFilter[key] = data[key];
      });
      solutions = await Solution.find(solutionsFilter)
        .populate("id_problem")
        .populate("id_student")
        .lean();
      solutions = solutions.map((solution) => new SolutionDto(solution));
    }

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
    const { id_problem, content, id_homework } = body;

    if (content.length < 5)
      throw ApiError.BadRequest("Invalid solution (min 5 characters)");
    const userId = req.user.payload.id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw ApiError.BadRequest("User does not exist");
    }
    const problem = await Problem.findOne({ _id: id_problem });
    if (!problem) {
      throw ApiError.BadRequest("Problem does not exist");
    }
    let solution;
    if (id_homework) {
      const homeworkProb = await HomeworkProblems.findOne({
        id_homework,
        id_problem,
      });
      if (!homeworkProb) {
        throw ApiError.BadRequest("Homework does not contain this problem");
      }
      const rezolvata = await Solution.findOne({
        id_problem,
        id_student: userId,
        id_homework,
      }).lean();
      // console.log(rezolvata);
      if (rezolvata) {
        throw ApiError.BadRequest("Ai rezolvat deja problema");
      }
      solution = await Solution.create({
        id_problem,
        id_student: userId,
        id_homework,
        content,
      });
    } else {
      solution = await Solution.create({
        id_problem,
        id_student: userId,
        content,
      });
    }

    res.statusCode = 201;
    res.end(JSON.stringify(new SolutionDto(solution)));
  } catch (e) {
    errorMiddleware(res, e);
    console.log(e);
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

export const evaluateSolution = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const body = JSON.parse(req.data);
    const { id, grade } = body;
    console.log(id, grade);

    const solution = await Solution.findByIdAndUpdate(id, {
      grade: grade,
    });

    res.statusCode = 200;
    res.end(JSON.stringify(solution));
  } catch (e) {
    errorMiddleware(res, e);
  }
};
