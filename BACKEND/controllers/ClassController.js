import { Class } from "../models/classModel.js";
import { User } from "../models/userModel.js";

import { ClassStudents } from "../models/classStudentsModel.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";
import ApiError from "../exceptions/apiError.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import queryParams from "../utils/queryParams.js";
import ClassDto from "../dtos/ClassDto.js";

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
      console.log(classes);
    } else if (type.role === "student") {
      classes = await ClassStudents.find({
        id_student: userId,
      }).lean();
      console.log(classes);
    }
    res.statusCode = 200;
    res.end(JSON.stringify({ classes }));
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
