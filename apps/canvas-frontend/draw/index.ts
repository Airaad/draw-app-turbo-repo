import { Shape } from "@/types/interface";

export function canvasSetup(
  canvas: HTMLCanvasElement,
  shape: "rectangle" | "circle",
  storedDrawings: Shape[],
  socket: WebSocket,
  roomId: string,
  roomName: string
) {
  const ctx = canvas.getContext("2d");
  let existingDrawings: Shape[] = [...storedDrawings];
  if (!ctx) {
    return;
  }
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  let clicked = false;
  let startX: number;
  let startY: number;

  const handleMouseDown = (e: MouseEvent) => {
    clicked = true;
    startX = e.offsetX;
    startY = e.offsetY;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (clicked) {
      const width = e.offsetX - startX;
      const height = e.offsetY - startY;
      const radius = Math.sqrt(width * width + height * height);
      showExistingDrawings(existingDrawings, canvas, ctx);
      if (shape === "rectangle") {
        ctx.strokeRect(startX, startY, width, height);
      } else if (shape === "circle") {
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    clicked = false;
    const width = e.offsetX - startX;
    const height = e.offsetY - startY;
    const radius = Math.sqrt(width * width + height * height);
    if (shape === "rectangle") {
      socket.send(
        JSON.stringify({
          type: "chat",
          roomSlug: roomName,
          message: {
            type: "rectangle",
            xCoordinate: startX,
            yCoordinate: startY,
            width: width,
            height: height,
          },
        })
      );
      existingDrawings.push({
        type: "rectangle",
        xCoordinate: startX,
        yCoordinate: startY,
        width: width,
        height: height,
      });
    } else if (shape === "circle") {
      socket.send(
        JSON.stringify({
          type: "chat",
          roomSlug: roomName,
          message: {
            type: "circle",
            xCoordinate: startX,
            yCoordinate: startY,
            radius: radius,
            startAngle: 0,
            endAngle: 2 * Math.PI,
          },
        })
      );
      existingDrawings.push({
        type: "circle",
        xCoordinate: startX,
        yCoordinate: startY,
        radius: radius,
        startAngle: 0,
        endAngle: 2 * Math.PI,
      });
    }
  };

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);

  showExistingDrawings(existingDrawings, canvas, ctx);

  return () => {
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mousemove", handleMouseMove);
    canvas.removeEventListener("mouseup", handleMouseUp);
  };
}

function showExistingDrawings(
  existingDrawings: any,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  existingDrawings.forEach((drawing: any) => {
    ctx.beginPath();

    if (drawing.type === "rectangle") {
      ctx.strokeRect(
        drawing.xCoordinate,
        drawing.yCoordinate,
        drawing.width,
        drawing.height
      );
    } else if (drawing.type === "circle") {
      ctx.arc(
        drawing.xCoordinate,
        drawing.yCoordinate,
        drawing.radius,
        drawing.startAngle,
        drawing.endAngle
      );
      ctx.stroke();
    }
  });
}
