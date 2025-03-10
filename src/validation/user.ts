import * as Joi from "joi";
import { UserInput } from "../interfaces/user";

export function validateUser(user: UserInput) {
  const JoiSchema = Joi.object({
    name: Joi.string().min(5).max(30).required(),
    email: Joi.string().email().min(5).max(50).required(),
    password: Joi.string().min(5).max(50).required(),

  }).options({ abortEarly: false });

  return JoiSchema.validate(user);
}

export function validateUserWithoutName(user: Omit<UserInput, "name">) {
  const JoiSchema = Joi.object({
    email: Joi.string().email().min(5).max(50).required(),
    password: Joi.string().min(1).required(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(user);
}
