/* eslint-disable @typescript-eslint/no-this-alias */

import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";
import { USER_Role } from "./user.constant";
import config from "../../config";
import bcryptjs from "bcryptjs";


const userSchema = new Schema<TUser>({
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: Object.keys(USER_Role),
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: 0,
    },
   
 
  },
  {
    timestamps:true
});
  
  userSchema.pre("save", async function (next) {
    const user = this;
  
    user.password = await bcryptjs.hash(user.password, Number(config.salt_round));
  
    next();
  });
  userSchema.post("save", function (doc, next) {
    doc.password = "";
  
    next();
  });
  
  export const User = model<TUser>("User", userSchema);