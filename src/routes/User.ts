import { Router, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validateUser, validateUserWithoutName } from "../validation/user";
import { UserInput } from "../interfaces/user";
import { errorHandler } from "../utils/error-handler";
import { authenticateJWT } from "../utils/auth-middleware";
import { AuthRequest } from "../interfaces/auth-request";
import prisma from "../utils/prisma";
import validationErrorHandler from "../utils/validation-error-handler";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
   const { name, email, password } = req.body;
   const hashedPassword = await bcrypt.hash(password, 11);
   const reqBody: UserInput = {
      name,
      email,
      password,
   };

   const response = validateUser(reqBody);
   validationErrorHandler(response, res);

   try {
      if (name) {
         const createdUser = await prisma.user.create({
            data: {
               ...reqBody,
               password: hashedPassword,
            },
         });
         const { password: _, ...userWithoutPassword } = createdUser;

         res.status(200).json(userWithoutPassword);
      } else {
         res.status(203).json({
            error: "Name needed",
         });
      }
   } catch (error) {
      errorHandler(error as Error, req, res);
   }
});

router.post("/login", async (req: Request, res: Response) => {
   const { email, password } = req.body;
   const reqBody: Omit<UserInput, "name"> = {
      email,
      password,
   };
   const response = validateUserWithoutName(reqBody);
   validationErrorHandler(response, res);

   try {
      const existingUser = await prisma.user.findUnique({
         where: { email },
      });

      if (!existingUser) {
         res.status(404).json({ error: "User not found" });
         return;
      }
      const passwordMatch = await bcrypt.compare(
         password,
         existingUser.password
      );
      if (!passwordMatch) {
         res.status(401).json({ error: "Authentication failed" });
         return;
      }

      // Creating JWT token
      const token = jwt.sign(
         {
            userId: existingUser.id,
            email: existingUser.email,
            type: existingUser.type,
            name: existingUser.name,
         },
         process.env.JWT_SECRET as string,
         { expiresIn: "24h" }
      );

      res.status(200).json({
         userId: existingUser.id,
         email: existingUser.email,
         token,
      });
   } catch (error) {
      errorHandler(error as Error, req, res);
   }
});

router.get(
   "/user",
   authenticateJWT,
   async (req: AuthRequest, res: Response) => {
      res.status(200).json({ data: req.user });
   }
);

export default router;
