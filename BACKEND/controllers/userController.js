import bcrypt from "bcryptjs";
const { hash } = bcrypt;
import { User } from "../models/userModel.js";
import UserDto from "../dtos/userDto.js";
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
    return errorMiddleware(res, e.status, e.message, e.errors);
  }
};

export const userLogin = async (req, res) => {
  try {
    const body = JSON.parse(req.data);
    const { email, password } = body;

    const user = await User.findOne({
      email,
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
    res.setHeader(
      "Set-Cookie",
      `refreshToken=${tokens.refreshToken}; Expires=${tokenExpiryDate.toUTCString()}; HttpOnly`
    );
    return res.end(
      JSON.stringify({
        ...tokens,
        user: userDto,
      })
    );
  } catch (e) {
    if (e instanceof ApiError)
      return errorMiddleware(res, e.status, e.message, e.errors);
    console.log(e);
    errorMiddleware(res, 500, "Server error");
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
    res.end(JSON.stringify({ token: refreshToken }));
  } catch (e) {
    errorMiddleware(res, 500, "Server error");
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
    console.log(username, email);
    if (usernameExists || emailExists) {
      errorMiddleware(res, 409, "Username or email are already registered");
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
    return res.end(
      JSON.stringify({
        ...tokens,
        user: userDto,
      })
    );
  } catch (e) {
    if (e instanceof ApiError)
      return errorMiddleware(res, e.status, e.message, e.errors);
    errorMiddleware(res, 500, "Server error");
  }
};

export const userRefresh = async (req, res) => {
  try {
    const cookies = cookieParser(req.headers.cookie);
    const refreshToken = cookies["refreshToken"];
    res.end(JSON.stringify(updateToken(refreshToken)));
  } catch (e) {
    errorMiddleware(res, 500, "Server error");
  }
};
