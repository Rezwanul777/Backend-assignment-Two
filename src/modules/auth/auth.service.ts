
/* eslint-disable @typescript-eslint/no-explicit-any */

import { TLoginUser } from "./auth.interface";
import jwt from "jsonwebtoken";
import config from "../../config";
import { TUser } from "../users/user.interface";
import { User } from "../users/user.model";
import { USER_Role } from "../users/user.constant";
import { isPasswordMatched } from "./auth.utils";

const register = async (payload: TUser): Promise<any> => {
  //user existence check
  const user = await User.findOne({ email: payload.email });

  if (user) {
    throw new Error("User already exists");
  }

  //set user role
 
  if (payload.role !== USER_Role.admin && payload.role !== USER_Role.user) {
    payload.role = USER_Role.user; // Default to 'user' if role is not provided or invalid
  }

  //create user
  const newUser = await User.create(payload);

  return newUser;
};

const login = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email }).select("+password");

  if (!user) {
    throw new Error("User not found");
  }


  const passwordMatch = await isPasswordMatched(
    payload.password,
    user.password
  );

  if (!passwordMatch) {
    throw new Error("Password not matched");
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expires_in,
  });

  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_refresh_secret as string,
    {
      expiresIn: config.jwt_refresh_expires_in,
    }
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthServices = {
  register,
  login,
};