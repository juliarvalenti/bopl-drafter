import React, { useState } from "react";

const RoomLobby: React.FC<RoomLobbyProps> = ({ onJoinRoom }) => {
  const [roomInput, setRoomInput] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (roomInput.trim() !== "") {
      onJoinRoom(roomInput.trim());
    }
  };

  return (
    <div className="room-lobby">
      <h2>Join or Create a Room</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter room ID"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
        />
        <button type="submit">Enter Room</button>
      </form>
    </div>
  );
};

interface RoomLobbyProps {
  onJoinRoom: (id: string) => void;
}

export default RoomLobby;
