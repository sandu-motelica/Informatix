import bcrypt from "bcryptjs";
const { hash } = bcrypt;
import { User } from "../models/userModel.js";
import { Solution } from "../models/solutionModel.js";
import { Problem } from "../models/problemModel.js";
import UserDto from "../dtos/UserDto.js";
import {
  deleteToken,
  generateTokens,
  saveToken,
  updateToken,
} from "../utils/token.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";
import ApiError from "../exceptions/apiError.js";
import { userRegisterValidation } from "../validations/userValidation.js";
import cookieParser from "../utils/cookieParser.js";
import authMiddleware from "../middlewares/authMiddleware.js";

export const getUsers = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const users = await User.find({});
    res.statusCode = 200;
    res.end(JSON.stringify(users));
  } catch (e) {
    errorMiddleware(res, e);
  }
};

export const userLogin = async (req, res) => {
  try {
    const body = JSON.parse(req.data);
    const { email, password, admin } = body;

    const user = await User.findOne({
      email,
      ...(admin
        ? { role: "admin" }
        : { role: { $in: ["student", "teacher"] } }),
    });
    if (!user) {
      throw ApiError.BadRequest("Invalid email or password");
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      throw ApiError.BadRequest("Invalid email or password");
    }
    const userDto = new UserDto(user);
    const tokens = generateTokens({ ...userDto });

    await saveToken(userDto.id, tokens.refreshToken);
    const tokenExpiryDate = new Date();
    tokenExpiryDate.setDate(tokenExpiryDate.getDate() + 30);
    res.writeHead(200, {
      "Set-Cookie": `refreshToken=${tokens.refreshToken}; Expires=${tokenExpiryDate.toUTCString()}; HttpOnly`,
      "Content-Type": `text/plain`,
    });

    return res.end(
      JSON.stringify({
        ...tokens,
        user: userDto,
      })
    );
  } catch (e) {
    errorMiddleware(res, e);
  }
};

export const userLogout = async (req, res) => {
  try {
    const cookies = cookieParser(req.headers.cookie);
    const refreshToken = cookies["refreshToken"];
    await deleteToken(refreshToken);
    res.setHeader(
      "Set-Cookie",
      "refreshToken=deleted; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
    );
    res.writeHead(200);
    res.end(JSON.stringify({ token: refreshToken }));
  } catch (e) {
    errorMiddleware(res, e);
  }
};

export const userRegister = async (req, res) => {
  try {
    const body = JSON.parse(req.data);
    const { username, email, role, password } = body;

    userRegisterValidation(username, email, password, role);

    let usernameExists = false;
    let emailExists = false;
    await Promise.all([
      (usernameExists = await User.findOne({ username })),
      (emailExists = await User.findOne({ email })),
    ]);
    if (usernameExists || emailExists) {
      errorMiddleware(res, {
        status: 409,
        message: "Username or email is already registered",
      });
    }
    const hashPassword = await hash(password, 3);
    const user = await User.create({
      username,
      email,
      role,
      password: hashPassword,
    });
    const userDto = new UserDto(user);
    const tokens = generateTokens({ ...userDto });
    await saveToken(userDto.id, tokens.refreshToken);
    const tokenExpiryDate = new Date();
    tokenExpiryDate.setDate(tokenExpiryDate.getDate() + 30);
    res.setHeader(
      "Set-Cookie",
      `refreshToken=${tokens.refreshToken}; Expires=${tokenExpiryDate.toUTCString()}; HttpOnly`
    );
    res.writeHead(200);
    return res.end(
      JSON.stringify({
        ...tokens,
        user: userDto,
      })
    );
  } catch (e) {
    errorMiddleware(res, e);
  }
};

export const userRefresh = async (req, res) => {
  try {
    const cookies = cookieParser(req.headers.cookie);
    const refreshToken = cookies["refreshToken"];
    res.end(JSON.stringify(updatedRefreshToken));
  } catch (e) {
    console.log(e);
    errorMiddleware(res, e);
  }
};

export const userInfo = async (req, res) => {
  await authMiddleware(req, res);
  const userId = req.user.payload.id;
  const user = await User.findOne({ _id: userId });

  // const solutions = await Solution.find({ id_student: userId }).lean();
  // const problems = await Problem.find().lean();
  // const problemDifficultyMap = {};
  // problems.forEach((problem) => {
  //   problemDifficultyMap[problem._id.toString()] = problem.difficulty;
  // });

  // const solutionsWithDifficulty = solutions.map((solution) => {
  //   const problemId = solution.id_problem.toString();
  //   const difficulty = problemDifficultyMap[problemId];
  //   return { ...solution, difficulty };
  // });

  res.statusCode = 200;
  res.end(
    JSON.stringify({
      user: new UserDto(user),
      // solutions: solutionsWithDifficulty,
    })
  );
};
