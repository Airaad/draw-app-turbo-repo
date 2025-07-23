import jwt, { JwtPayload } from "jsonwebtoken";
import { WebSocketServer } from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket, request) => {
  const url = request.url; // ws://localhost:3000?token=123123
  if (!url) {
    return;
  }
  const queryParam = new URLSearchParams(url?.split("?")[1]); // token=123123
  const query = queryParam.get("token") ?? ""; //123123

  const decode = jwt.verify(query, JWT_SECRET);

  if (!decode || !(decode as JwtPayload).userID) {
    socket.close();
    return;
  }
  socket.on("message", (data) => {
    socket.send("pong");
  });
});
