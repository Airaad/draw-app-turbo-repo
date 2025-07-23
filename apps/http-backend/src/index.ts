import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { userSchema, siginSchema, roomSchema } from "@repo/common/type";
import { authMiddleware } from "./middleware";

const port = 3001;
const app = express();

app.use(express.json());

app.post("/signup", (req, res) => {
  const validatedData = userSchema.safeParse(req.body);

  if (!validatedData.success) {
    res.status(403).json({
      message: "Not valid input",
    });
    return;
  }

  return res.status(201).json({
    message: "successfullt registered",
  });
});

app.post("/sigin", authMiddleware, (req, res) => {
  const validatedData = siginSchema.safeParse(req.body);

  if (!validatedData.success) {
    res.status(403).json({
      message: "Not valid input",
    });
    return;
  }

  const userId = 1;

  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  return res.status(201).json({
    token,
  });
});

app.post("/room", (req, res) => {});

app.listen(port);
