import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { userSchema, siginSchema, roomSchema } from "@repo/common/type";
import { authMiddleware } from "./middleware";
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt";

const port = 3001;
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const validatedData = userSchema.safeParse(req.body);

  if (!validatedData.success) {
    res.status(403).json({
      message: "Not valid input",
    });
    return;
  }
  try {
    const isAlreadyUser = await prismaClient.user.findFirst({
      where: { username: validatedData.data.username },
    });
    if (isAlreadyUser) {
      return res.status(402).json({
        message: "User with this username already exists.",
      });
    }
    const hashedPasswrod = await bcrypt.hash(validatedData.data.password, 10);
    const newUser = await prismaClient.user.create({
      data: {
        username: validatedData.data.username,
        password: hashedPasswrod,
        name: validatedData.data.name,
      },
    });
    res.status(201).json({
      user: newUser,
      message: "User signup successfull",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
    });
  }

  return res.status(201).json({
    message: "successfullt registered",
  });
});

app.post("/signin", async (req, res) => {
  const validatedData = siginSchema.safeParse(req.body);

  if (!validatedData.success) {
    res.status(403).json({
      message: "Not valid input",
    });
    return;
  }

  try {
    const isUser = await prismaClient.user.findFirst({
      where: { username: validatedData.data.username },
    });
    if (!isUser) {
      return res.json({
        messsage: "No user exists with this username",
      });
    }
    const isValidPassword = await bcrypt.compare(
      validatedData.data.password,
      isUser.password
    );

    if (!isValidPassword) {
      res.status(401).json({
        message: "Incorrect credentials!",
      });
    }

    const userId = isUser.id;
    const token = jwt.sign(
      {
        userId,
      },
      JWT_SECRET
    );

    return res.status(201).json({
      token,
      message: "User signed in successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
});

app.post("/create-room", authMiddleware, async (req, res) => {
  const validatedData = roomSchema.safeParse(req.body);

  if (!validatedData.success) {
    res.status(403).json({
      message: "Not valid input",
    });
    return;
  }
  try {
    //@ts-ignore
    const userId = req.userId;

    const isAlreadyRoom = await prismaClient.room.findFirst({
      where: { slug: validatedData.data.name },
    });
    if (isAlreadyRoom) {
      res.status(201).json({
        message: "Room with a same name already exists",
      });
    }
    const roomId = await prismaClient.room.create({
      data: {
        slug: validatedData.data.name,
        adminId: userId,
      },
    });

    res.status(201).json({
      roomId: roomId.id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
});

app.get("/room-chats", async (req, res) => {});

app.listen(port);
