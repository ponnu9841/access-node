import { User } from "@prisma/client";

export type UserInput = Pick<User, "name" | "email" | "password">;