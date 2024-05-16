import jwt from "jsonwebtoken";
import { Token } from "../models/tokenModel.js";
import ApiError from "../exceptions/apiError.js";
import { User } from "../models/userModel.js";
import UserDto from "../dtos/UserDto.js";

export const generateTokens = (payload) => {
  const accessToken = jwt.sign(
    { payload: payload },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "5d",
    }
  );
  const refreshToken = jwt.sign(
    { payload: payload },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "30d",
    }
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const saveToken = async (userId, refreshToken) => {
  const tokenData = await Token.findOne({ user: userId });
  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }

  const token = await Token.create({ user: userId, refreshToken });
  return token;
};

export const deleteToken = async (refreshToken) => {
  const tokenData = await Token.deleteOne({ refreshToken });
  return tokenData;
};

export const validateAccessToken = async (token) => {
  try {
    const userData = await jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return userData;
  } catch (e) {
    return null;
  }
};

export const validateRefreshToken = async (token) => {
  try {
    const userData = await jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    return userData;
  } catch (e) {
    return null;
  }
};

export const updateToken = async (refreshToken) => {
  console.log(refreshToken);
  if (!refreshToken) throw ApiError.UnauthorizedError();
  const { payload } = await validateRefreshToken(refreshToken);
  const tokenData = await Token.findOne({ refreshToken });
  if (!payload || !tokenData) {
    throw ApiError.UnauthorizedError();
  }

  const user = await User.findById(payload.id);

  const userDto = new UserDto(user);
  const tokens = generateTokens(userDto);
  saveToken(userDto.id, tokens.refreshToken);
  return { ...tokens, user: userDto };
};
