import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
   user?: any;
}

export const authenticateJWT = (
   req: AuthRequest,
   res: Response,
   next: NextFunction
) => {
   const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
   const authHeader = req.headers.authorization;

   if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized" });
      return;
   }

   const token = authHeader.split(" ")[1];

   if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
   }

   try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded;
      return next();
   } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
      return;
   }
};

export const isAdmin = (
   req: AuthRequest,
   res: Response,
   next: NextFunction
) => {
   // This assumes you have user type or roles stored in the token
   // You can modify according to your user data structure
   if (req.user && req.user.type === "admin") {
      // Here you would check if the user is an admin
      // For example: if(req.user.type === 'admin')
      next();
   } else {
      res.status(403).json({ error: "UnAuthorized" });
   }
};
