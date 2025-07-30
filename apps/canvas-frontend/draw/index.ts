type Shape =
  | {
      type: "rectangle";
      xCoordinate: number;
      yCoordinate: number;
      height: number;
      width: number;
    }
  | {
      type: "circle";
      xCoordinate: number;
      yCoordinate: number;
      radius: number;
      startAngle: number;
      endAngle: number;
    };

export function canvasSetup(
  canvas: HTMLCanvasElement,
  shape: "rectangle" | "circle",
  storedDrawings: any,
  socket: WebSocket,
  roomId: string,
  roomName: string
) {
  console.log("hi there here are the stored drawing", storedDrawings);

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

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      const radius = Math.sqrt(width * width + height * height);
      showExistingDrawings(existingDrawings, canvas, ctx, shape);
      if (shape === "rectangle") {
        ctx.strokeRect(startX, startY, width, height);
      } else if (shape === "circle") {
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;
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
  });
}

function showExistingDrawings(
  existingDrawings: any,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  shape: "rectangle" | "circle"
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
