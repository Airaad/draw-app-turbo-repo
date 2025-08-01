import jwt, { JwtPayload } from "jsonwebtoken";
import { WebSocket, WebSocketServer } from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  userId: string;
  rooms: string[];
  socket: WebSocket;
}

function isAuthenticated(token: string): string | null {
  try {
    const decode = jwt.verify(token, JWT_SECRET);
    if (typeof decode === "string") {
      return null;
    }
    if (!decode || !decode.userId) {
      return null;
    }
    return decode.userId;
  } catch (error) {
    return null;
  }
  return null;
}

async function isValidRoom(slug: string): Promise<number | null> {
  try {
    const validRoom = await prismaClient.room.findUnique({
      where: { slug: slug },
    });
    if (!validRoom) {
      return null;
    }
    return validRoom.id;
  } catch (error) {
    return null;
  }
  return null;
}

const users: User[] = [];

wss.on("connection", (socket, request) => {
  const url = request.url; // ws://localhost:8080?token=123123
  if (!url) {
    return;
  }
  const queryParam = new URLSearchParams(url?.split("?")[1]); // token=123123
  const query = queryParam.get("token") ?? ""; //123123

  //To check is user authenticated
  const userId = isAuthenticated(query);

  if (!userId) {
    socket.close();
    return;
  }

  //On connection user is pushed to the users array
  users.push({
    userId,
    rooms: [],
    socket,
  });

  console.log("Number of users",users.length);
  

  socket.on("message", async (data) => {
    const parsedData = JSON.parse(data as unknown as string);
    //To check does room exists or not
    const roomId = await isValidRoom(parsedData.roomSlug);

    if (!roomId) {
      return;
    }

    // data: {type: "join", roomSlug: "chat-room-1"}
    if (parsedData.type === "join") {
      const user = users.find((x) => x.socket === socket);
      user?.rooms.push(parsedData.roomSlug);
    }

    // data: {type: "leave", roomSlug: "chat-room-1"}
    if (parsedData.type === "leave") {
      const user = users.find((x) => x.socket === socket);
      if (!user) {
        return;
      }
      user.rooms = user?.rooms.filter((x) => x !== parsedData.roomSlug);
    }

    // data: {type: "chat", roomSlug: "chat-room-1",  messsage: "Hi there"}
    if (parsedData.type === "chat") {
      const roomSlug = parsedData.roomSlug;
      const message = parsedData.message;

      //To check is user subscribed to the room or not.
      // const user = users.find((x) => x.socket === socket);
      // if (!user?.rooms.includes(roomSlug)) {
      //   return;
      // }

      // DatabaseCall to store the messages
      await prismaClient.chat.create({
        data: {
          message: JSON.stringify(message),
          userId: userId,
          roomId: roomId,
        },
      });

      users.forEach((user) => {
        if (user.rooms.includes(roomSlug)) {
          user.socket.send(
            JSON.stringify({
              message: message,
            })
          );
        }
      });
    }
  });
});
