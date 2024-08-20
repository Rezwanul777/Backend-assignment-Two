import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";

import { catchAsync } from "../utils/catchAsync";
import { USER_Role } from "../modules/users/user.constant";
import { User } from "../modules/users/user.model";



export const auth = (...requiredRoles: (keyof typeof USER_Role)[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const accessToken = req.headers.authorization;
  
      if (!accessToken) {
        throw new AppError(401, "You are not authorized to access this route");
      }
  
      const verfiedToken = jwt.verify(
        accessToken as string,
        config.jwt_access_secret as string
      );
  
      const { role, email } = verfiedToken as JwtPayload;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        throw new AppError(401, "User not found");
      }
  
   
  
      if (!requiredRoles.includes(role)) {
        throw new AppError(401, "You are not authorized to access this route");
      }
  
      next();
    });
  };