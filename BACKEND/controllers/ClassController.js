import { Class } from "../models/classModel.js";
import { User } from "../models/userModel.js";
import { Homework } from "../models/homeworkModel.js";
import { HomeworkProblems } from "../models/homeworkProblemsModel.js";

import { ClassStudents } from "../models/classStudentsModel.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";
import ApiError from "../exceptions/apiError.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import queryParams from "../utils/queryParams.js";
import ClassDto from "../dtos/ClassDto.js";
import UserDto from "../dtos/UserDto.js";

export const getClasses = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const data = queryParams(req);
    const userId = req.user.payload.id;
    const type = await User.findOne({
      _id: userId,
    }).lean();
    let classes;
    if (type.role === "teacher") {
      classes = await Class.find({
        id_profesor: userId,
      }).lean();
    } else if (type.role === "student") {
      classes = await ClassStudents.find({
        id_student: userId,
      }).lean();
      const classesId = classes.map((clasa) => clasa.id_class);
      classes = await Class.find({ _id: { $in: classesId } }).lean();
    }
    if (data.id) {
      const classData = await Class.findOne({ _id: data.id }).lean();
      if (!classData) {
        throw ApiError.BadRequest("Class not found");
      }
      const prof = await User.findOne({
        _id: classData.id_profesor,
      }).lean();
      const classMembers = await ClassStudents.find({
        id_class: data.id,
      });
      const classMembersId = classMembers.map((member) => member.id_student);
      const members = await User.find({ _id: { $in: classMembersId } }).lean();
      const membersList = members.map((member) => new UserDto(member));
      classes = {
        classes: new ClassDto(classData),
        prof_name: prof.username,
        members: membersList,
      };
    }
    res.statusCode = 200;
    res.end(JSON.stringify(classes));
  } catch (e) {
    errorMiddleware(res, e);
  }
};
export const createClass = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const body = JSON.parse(req.data);
    const { name } = body;
    if (name.length < 5)
      throw ApiError.BadRequest("Invalid class name (min 5 characters)");
    const userId = req.user.payload.id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw ApiError.BadRequest("User does not exist");
    }
    if (user.role != "teacher") {
      throw ApiError.BadRequest("Permission denied!");
    }
    const classCreate = await Class.create({
      name,
      id_profesor: userId,
    });
    res.statusCode = 201;
    res.end(JSON.stringify(new ClassDto(classCreate)));
  } catch (e) {
    errorMiddleware(res, e);
  }
};

export const addMember = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const body = JSON.parse(req.data);
    const { username, idClass } = body;
    const userId = req.user.payload.id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw ApiError.BadRequest("User[you] does not exist");
    }
    const creator = await Class.findOne({ id_profesor: userId, _id: idClass });
    if (!creator) {
      throw ApiError.BadRequest("Permission denied!");
    }
    const addUser = await User.findOne({ username });
    if (!addUser) {
      throw ApiError.BadRequest("User does not exist");
    }
    if (addUser.role != "student") {
      throw ApiError.BadRequest("User is not a student");
    }
    const classMember = await ClassStudents.create({
      id_class: idClass,
      id_student: addUser._id,
    });
    res.statusCode = 201;
    res.end(JSON.stringify({ id_class: idClass, id_student: addUser._id }));
  } catch (e) {
    errorMiddleware(res, e);
  }
};

export const deleteClass = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const body = JSON.parse(req.data);
    const { classId } = body;
    if (!classId) {
      throw ApiError.BadRequest("Class ID is required");
    }

    const userId = req.user.payload.id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw ApiError.BadRequest("User does not exist");
    }
    const classData = await Class.findOne({
      _id: classId,
      id_profesor: userId,
    });
    if (!classData) {
      throw ApiError.BadRequest("Class not found or you're not the creator");
    }

    const homeworks = await Homework.find({ id_class: classId }).lean();
    const homeworkIds = homeworks.map((homework) => homework._id);

    await HomeworkProblems.deleteMany({ id_homework: { $in: homeworkIds } });

    await Homework.deleteMany({ id_class: classId });

    await Class.deleteOne({ _id: classId });

    await ClassStudents.deleteMany({ id_class: classId });

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        message: "Class and related homeworks deleted successfully",
      })
    );
  } catch (e) {
    errorMiddleware(res, e);
  }
};

export const deleteUser = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const body = JSON.parse(req.data);
    const { idClass, username } = body;

    if (!username) {
      throw ApiError.BadRequest("Username is required");
    }
    if (!idClass) {
      throw ApiError.BadRequest("Class ID is required");
    }
    const userId = req.user.payload.id;
    const me = await User.findOne({ _id: userId });
    if (!me) {
      throw ApiError.BadRequest("User[you] does not exist");
    }
    const classData = await Class.findOne({
      _id: idClass,
      id_profesor: userId,
    });
    if (!classData) {
      throw ApiError.BadRequest("Class not found or you're not the creator");
    }
    const user = await User.findOne({ username });
    if (!user) {
      throw ApiError.BadRequest("User[to remove] not found");
    }

    if (user.role === "student") {
      await ClassStudents.deleteOne({
        id_student: user._id,
        id_class: idClass,
      });
    }

    res.statusCode = 200;
    res.end(JSON.stringify({ message: "User deleted successfully" }));
  } catch (e) {
    errorMiddleware(res, e);
  }
};
