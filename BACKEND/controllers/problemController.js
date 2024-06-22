import { Problem, problemSchema } from "../models/problemModel.js";
import { User } from "../models/userModel.js";
import { Tag } from "../models/tagModel.js";
import { ProblemTags } from "../models/problemTagsModel.js";
import { Solution } from "../models/solutionModel.js";
import ProblemDto from "../dtos/problemDto.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";
import ApiError from "../exceptions/apiError.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import queryParams from "../utils/queryParams.js";
import { Rating } from "../models/ratingModel.js";
import { PendingHomeworkProblem } from "../models/pendingHomeworkProblems.js";

export const getProblems = async (req, res) => {
  try {
    await authMiddleware(req, res);

    const data = queryParams(req);

    const userId = req.user.payload.id;

    //TODO: Improve this part
    //Get specific fields only for problem model
    const problemsFilter = {};
    Object.keys(problemSchema.paths).forEach((key) => {
      if (data[key]) problemsFilter[key] = data[key];
    });

    if (data.search) {
      problemsFilter.title = new RegExp(data.search, "i");
      // problemsFilter.description = new RegExp(data.search, "i");
    }

    const problems = await Problem.find(problemsFilter);

    const problemTagsMap = {};

    const problemTags = await ProblemTags.find({}).lean();
    const tagIds = problemTags.map((pt) => pt.id_tag);

    const tags = await Tag.find({ _id: { $in: tagIds } }).lean();

    const tagsMap = tags.reduce((acc, tag) => {
      acc[tag._id] = tag.name;
      return acc;
    }, {});

    problemTags.forEach((pt) => {
      if (!problemTagsMap[pt.id_problem]) {
        problemTagsMap[pt.id_problem] = [];
      }
      problemTagsMap[pt.id_problem].push(tagsMap[pt.id_tag]);
    });

    const userSolutions = await Solution.find({
      id_student: userId,
    }).lean();

    const solvedProblemsSet = new Set(
      userSolutions.map((solution) => solution.id_problem.toString())
    );

    let problemsWithDetails = await Promise.all(
      problems.map(async (problem) => {
        const totalSolutions = await Solution.find({
          id_problem: problem._id,
        }).lean();

        const successfulSolutions = await Solution.find({
          id_problem: problem._id,
          grade: { $gte: 8 },
        }).lean();

        const successRate =
          totalSolutions.length > 0
            ? successfulSolutions.length / totalSolutions.length
            : 0;

        return {
          ...new ProblemDto(problem),
          tags: problemTagsMap[problem._id] || [],
          is_solved: solvedProblemsSet.has(problem._id.toString()),
          success_rate: successRate,
        };
      })
    );

    if (data?.is_solved != undefined) {
      problemsWithDetails = problemsWithDetails.filter((item) => {
        if (item.is_solved === data.is_solved) {
          return item;
        }
      });
    }

    await Promise.all(
      problemsWithDetails.map((item) => getProblemsRating(item.id))
    ).then((results) => {
      problemsWithDetails.forEach(
        (item, index) => (item.rating = results[index])
      );
    });

    res.statusCode = 200;
    res.end(JSON.stringify({ problems: problemsWithDetails.reverse() }));
  } catch (e) {
    console.log(e);
    errorMiddleware(res, e);
  }
};

export const getPendingProblems = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const userId = req.user.payload.id;
    const user = await User.findOne({
      _id: userId,
    });
    if (!user) {
      throw ApiError.BadRequest("User does not exist");
    }
    const problems = await PendingHomeworkProblem.find({
      id_author: userId,
    }).lean();
    problems.map((problem) => {
      return { id: problem._id, title: problem.title };
    });
    res.statusCode = 200;
    res.end(JSON.stringify({ problems }));
  } catch (e) {
    errorMiddleware(res, e);
  }
};

export const addProblem = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const body = JSON.parse(req.data);
    const { title, description, difficulty, tagNames, homework } = body;

    if (title.length < 5 || description.length < 5)
      throw ApiError.BadRequest(
        "Invalid problem title or description (min 5 characters)"
      );
    if (tagNames.length < 1)
      throw ApiError.BadRequest("Select problem category (at least one)");
    const id_author = req.user.payload.id;
    const user = await User.findOne({ _id: id_author });
    if (!user) {
      throw ApiError.BadRequest("User does not exist");
    }

    const problem = await Problem.create({
      title,
      description,
      difficulty,
      id_author: user.id,
    });

    if (homework) {
      const pedingProblem = await PendingHomeworkProblem.create({
        title,
        id_problem: problem._id,
        id_author: user.id,
      });
    }

    for (let i = 0; i < tagNames.length; i++) {
      let tag = await Tag.findOne({ name: tagNames[i] });
      if (!tag) {
        tag = await Tag.create({ name: tagNames[i] });
      }

      await ProblemTags.create({
        id_problem: problem.id,
        id_tag: tag.id,
      });
    }

    res.statusCode = 201;
    res.end(JSON.stringify(new ProblemDto(problem)));
  } catch (e) {
    errorMiddleware(res, e);
  }
};

export const removeProblem = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const body = JSON.parse(req.data);
    const { problemId } = body;
    const userId = req.user.payload.id;
    const problem = await Problem.findOne({ _id: problemId });
    if (!problem) {
      throw ApiError.BadRequest("Problem does not exist");
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw ApiError.BadRequest("User does not exist");
    }

    if (problem.id_author.toString() !== userId && user.role !== "admin") {
      throw ApiError.Unauthorized(
        "You are not the author of this problem or an admin"
      );
    }

    await Problem.deleteOne({ _id: problemId });

    res.statusCode = 200;
    res.end(JSON.stringify({ message: "Problem successfully deleted" }));
  } catch (e) {
    errorMiddleware(res, e);
  }
};

export const getNumberOfProbWithDiff = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const body = JSON.parse(req.data);
    const { difficulty } = body;

    const problems = await Problem.find({ difficulty }).lean();

    res.statusCode = 200;
    res.end(JSON.stringify({ count: problems.length }));
  } catch (e) {
    errorMiddleware(res, e);
  }
};

export const updateProblem = async (req, res) => {
  try {
    await authMiddleware(req, res);
    if (req.user.payload.role != "admin") throw ApiError.UnauthorizedError();
    const body = JSON.parse(req.data);
    const { problemId, status } = body;
    await Problem.findByIdAndUpdate(problemId, { status: status });
    res.statusCode = 200;
    res.end(JSON.stringify({ problemId: problemId }));
  } catch (e) {
    errorMiddleware(res, e);
  }
};

export const rateProblem = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const body = JSON.parse(req.data);

    const { id_problem, rate } = body;

    const rating = new Rating({
      id_problema: id_problem,
      id_user: req.user.payload.id,
      rate: rate,
    });

    await rating.save();

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        id_problema: id_problem,
        id_user: req.user.payload.id,
        rate,
      })
    );
  } catch (e) {
    console.log(e);
    errorMiddleware(res, e);
  }
};

const getProblemsRating = async (problemId) => {
  const data = await Rating.aggregate([
    {
      $match: {
        id_problema: problemId,
      },
    },
    {
      $group: {
        _id: "$id_problema",
        averageValue: { $avg: "$rate" },
      },
    },
  ]);
  return data[0]?.averageValue || 0;
};
