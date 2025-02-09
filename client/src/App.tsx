import React, { useState } from "react";
import Layout from "./components/layout";
import RoomLobby from "./components/room-lobby";
import DraftRoom from "./components/draft-room";

const App: React.FC = () => {
  // roomId is null when the user hasn't joined a room yet.
  const [roomId, setRoomId] = useState<string | null>(null);

  const handleJoinRoom = (id: string): void => {
    setRoomId(id);
  };

  const handleLeaveRoom = (): void => {
    setRoomId(null);
  };

  return (
    <Layout>
      {roomId ? (
        <DraftRoom roomId={roomId} onLeaveRoom={handleLeaveRoom} />
      ) : (
        <RoomLobby onJoinRoom={handleJoinRoom} />
      )}
    </Layout>
  );
};

export default App;
