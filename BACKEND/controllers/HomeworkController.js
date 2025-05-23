import { Homework } from "../models/homeworkModel.js";
import { Problem } from "../models/problemModel.js";
import { HomeworkProblems } from "../models/homeworkProblemsModel.js";
import { PendingHomeworkProblem } from "../models/pendingHomeworkProblems.js";
import { Class } from "../models/classModel.js";
import { ClassStudents } from "../models/classStudentsModel.js";
import { User } from "../models/userModel.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";
import ApiError from "../exceptions/apiError.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import queryParams from "../utils/queryParams.js";
import HomeworkDto from "../dtos/HomeworkDto.js";

export const getHomeworks = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const data = queryParams(req);
    const userId = req.user.payload.id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw ApiError.BadRequest("User does not exist");
    }
    let homeworks;
    if (data.id_homework) {
      const homework = await Homework.findOne({ _id: data.id_homework }).lean();
      if (!homework) {
        throw ApiError.BadRequest("Homework not found");
      }
      const classData = await Class.findOne({ _id: homework.id_class }).lean();
      if (
        user.role === "teacher" &&
        classData.id_profesor.toString() !== userId.toString()
      ) {
        throw ApiError.BadRequest("Permission denied!");
      } else if (user.role === "student") {
        const isMember = await ClassStudents.findOne({
          id_class: homework.id_class,
          id_student: userId,
        }).lean();

        if (!isMember) {
          throw ApiError.BadRequest("Permission denied!");
        }
      }

      let problems = await HomeworkProblems.find({
        id_homework: data.id_homework,
      }).lean();
      const problemIds = problems.map((problem) => problem.id_problem);
      problems = await Problem.find({ _id: { $in: problemIds } });
      problems = problems.map((problem) => {
        return {
          id: problem._id,
          title: problem.title,
          status: problem.status,
        };
      });
      homeworks = { homework: new HomeworkDto(homework), problems: problems };
    } else if (data.id_class) {
      const classData = await Class.findOne({ _id: data.id_class }).lean();
      if (
        user.role === "teacher" &&
        classData.id_profesor.toString() !== userId.toString()
      ) {
        throw ApiError.BadRequest("Permission denied!");
      } else if (user.role === "student") {
        const isMember = await ClassStudents.findOne({
          id_class: data.id_class,
          id_student: userId,
        }).lean();

        if (!isMember) {
          throw ApiError.BadRequest("Permission denied!");
        }
      }
      homeworks = await Homework.find({ id_class: data.id_class }).lean();
      homeworks = homeworks.map((hw) => new HomeworkDto(hw));
    } else {
      homeworks = await Homework.find().lean();
      homeworks = homeworks.map((hw) => new HomeworkDto(hw));
    }
    res.statusCode = 200;
    res.end(JSON.stringify(homeworks));
  } catch (e) {
    errorMiddleware(res, e);
  }
};

export const createHomework = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const body = JSON.parse(req.data);
    const { name, id_class, problemIds } = body;
    if (!name || !id_class || !Array.isArray(problemIds)) {
      throw ApiError.BadRequest("Name and Problems are required");
    }
    if (name.length < 5) {
      throw ApiError.BadRequest("Invalid class name (min 5 characters)");
    }
    if (problemIds.length < 1) {
      throw ApiError.BadRequest("Select at least one problem");
    }
    const userId = req.user.payload.id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw ApiError.BadRequest("User does not exists");
    }
    const clasa = Class.findOne({ _id: id_class });
    if (!clasa) {
      throw ApiError.BadRequest("Class does not exists");
    }
    const classData = await Class.findOne({
      _id: id_class,
      id_profesor: userId,
    });
    if (!classData) {
      throw ApiError.BadRequest("Permission denied");
    }

    const homework = await Homework.create({ name, id_class });

    const homeworkProblems = problemIds.map((problemId) => ({
      id_homework: homework._id,
      id_problem: problemId,
    }));

    await HomeworkProblems.insertMany(homeworkProblems);

    let pendingProblems = await PendingHomeworkProblem.find({
      id_author: userId,
    });
    pendingProblems = pendingProblems.map((problem) => ({
      id_homework: homework._id,
      id_problem: problem.id_problem,
    }));
    if (pendingProblems.length > 0) {
      await HomeworkProblems.insertMany(pendingProblems);
    }
    await PendingHomeworkProblem.deleteMany({ id_author: userId });

    res.statusCode = 201;
    res.end(JSON.stringify(new HomeworkDto(homework)));
  } catch (e) {
    errorMiddleware(res, e);
  }
};

export const deleteHomework = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const body = JSON.parse(req.data);
    const { homeworkId } = body;

    if (!homeworkId) {
      throw ApiError.BadRequest("Homework ID is required");
    }

    const userId = req.user.payload.id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw ApiError.BadRequest("User does not exist");
    }

    const homework = await Homework.findOne({
      _id: homeworkId,
    });
    if (!homework) {
      throw ApiError.BadRequest("Homework not found");
    }
    const profesor = await Class.findOne({
      _id: homework.id_class,
    });
    if (profesor.id_profesor.toString() !== userId.toString()) {
      throw ApiError.BadRequest("Permision denied");
    }

    await Homework.deleteOne({ _id: homeworkId });
    await HomeworkProblems.deleteMany({ id_homework: homeworkId });

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        message: "Homework deleted successfully",
        id_class: homework.id_class,
      })
    );
  } catch (e) {
    errorMiddleware(res, e);
  }
};
