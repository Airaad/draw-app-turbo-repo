import CanvasBoard from "@/components/CanvasBoard";
import React from "react";

async function CanvasPage({ params }: { params: Promise<{ roomId: string }> }) {

  const {roomId} = await params;
  
  return (
    <div>
      <CanvasBoard />
    </div>
  );
}

export default CanvasPage;
