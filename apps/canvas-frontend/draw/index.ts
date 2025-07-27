type Shape = {
  type: string;
  xCoordinate: number;
  yCoordinate: number;
  height: number;
  width: number;
};

export function canvasSetup(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  let existingDrawings: Shape[] = [];
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
      showExistingDrawings(existingDrawings, canvas, ctx);
      ctx.strokeRect(startX, startY, width, height);
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;
    existingDrawings.push({
      type: "rectangle",
      xCoordinate: startX,
      yCoordinate: startY,
      width: width,
      height: height,
    });
  });
}

function showExistingDrawings(
  existingDrawings: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  existingDrawings.map((drawing) => {
    ctx.strokeRect(
      drawing.xCoordinate,
      drawing.yCoordinate,
      drawing.width,
      drawing.height
    );
  });
}
