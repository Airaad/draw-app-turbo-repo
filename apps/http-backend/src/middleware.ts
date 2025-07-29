import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization ?? "";
  const decode = jwt.verify(token, JWT_SECRET);

  if (!decode) {
    return res.status(401).json({
      message: "unauthorized",
    });
  }

  //@ts-ignore
  req.userId = decode.userId;
  next();
}
