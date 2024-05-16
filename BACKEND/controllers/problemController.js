import bcrypt from "bcryptjs";
import { Problem } from "../models/problemModel.js";
import { User } from "../models/userModel.js";
import { Tag } from "../models/tagModel.js";
import { ProblemTags } from "../models/problemTagsModel.js";
import ProblemDto from "../dtos/problemDto.js";
import {
  deleteToken,
  generateTokens,
  saveToken,
  updateToken,
} from "../utils/token.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";
import ApiError from "../exceptions/apiError.js";
import authMiddleware from "../middlewares/authMiddleware.js";

export const getProblems = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const problems = await Problem.find({});
    res.statusCode = 200;
    res.end(JSON.stringify({ problems: problems }));
  } catch (e) {
    errorMiddleware(res, e);
  }
};
export const getTags = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const tags = await Tag.find({});
    res.statusCode = 200;
    res.end(JSON.stringify(tags));
  } catch (e) {
    errorMiddleware(res, e);
  }
};

export const getProblemTag = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const tags = await ProblemTags.find({});
    res.statusCode = 200;
    res.end(JSON.stringify(ProblemTags));
  } catch (e) {
    errorMiddleware(res, e);
  }
};

export const addProblem = async (req, res) => {
  try {
    const body = JSON.parse(req.data);
    const { id_author, title, description, difficulty, tagName } = body;

    const user = await User.findOne({ _id: id_author });
    if (!user) {
      throw ApiError.BadRequest("User does not exist");
    }

    let tag = await Tag.findOne({ name: tagName });
    if (!tag) {
      tag = await Tag.create({ name: tagName });
    }

    const problem = await Problem.create({
      title,
      description,
      difficulty,
      id_author: user.id,
    });

    const problemTag = await ProblemTags.create({
      id_problem: problem.id,
      id_tag: tag.id,
    });

    res.statusCode = 201;
    res.end(JSON.stringify(new ProblemDto(problem)));
  } catch (e) {
    errorMiddleware(res, e);
  }
};

export const removeProblem = async (req, res) => {
  try {
    const body = JSON.parse(req.data);
    const { userId, problemId } = body;

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
