import { Request, Response } from "express";
export const errorHandler = (err: Error, _req: Request, res: Response) => {
  res.status(500).json({ success: false, message: err.message });
  res
    .status(400)
    .json({ success: false, message: "Invalid request payload JSON" });
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, message: "Token expired" });
  }
};
