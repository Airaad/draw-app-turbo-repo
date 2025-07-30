export type Shape =
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
