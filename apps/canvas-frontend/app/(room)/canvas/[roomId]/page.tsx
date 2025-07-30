import CanvasBoard from "@/components/CanvasBoard";
import React from "react";

type PageProps = {
  params: Promise<{ roomId: string }>;
  searchParams?: Promise<{ roomName?: string }>;
};

async function CanvasPage({ params, searchParams }: PageProps) {
  const { roomId } = await params;
  const { roomName } = searchParams ? await searchParams : {};

  if (!roomName) {
    return <h1>No Room name available !</h1>;
  }

  return (
    <div>
      <CanvasBoard roomId={roomId} roomName={roomName} />
    </div>
  );
}

export default CanvasPage;
