import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import AbilityList from "./ability-list";

// Replace this URL with your actual Heroku app URL.
const SOCKET_SERVER_URL = "http://localhost:3000";

const DraftRoom: React.FC<DraftRoomProps> = ({ roomId, onLeaveRoom }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [action, setAction] = useState<string>("");
  const [actionType, setActionType] = useState<"ban" | "pick">("ban");

  useEffect(() => {
    // Initialize the Socket.IO client.
    const newSocket: Socket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Tell the server to join the specified room.
    newSocket.emit("joinRoom", roomId, { username: "User" }); // Replace with real user data if available.

    // Listen for room state updates.
    newSocket.on("roomUpdate", (updatedRoom: RoomState) => {
      setRoomState(updatedRoom);
    });

    // Clean up the socket when the component unmounts.
    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  const handleActionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (socket && action.trim() !== "") {
      // Emit a draft action with roomId, type, and the ability.
      socket.emit("draftAction", {
        roomId,
        action: actionType,
        ability: action.trim(),
      });
      setAction("");
    }
  };

  return (
    <div className="draft-room">
      <h2>Draft Room: {roomId}</h2>
      <button onClick={onLeaveRoom}>Leave Room</button>

      {roomState ? (
        <div className="room-state">
          <h3>Current Draft State</h3>
          <p>Current Phase: {roomState.draftState.currentPhaseIndex}</p>
          <p>
            Banned Abilities: {roomState.draftState.bannedAbilities.join(", ")}
          </p>
          <p>
            Player 1 Picks:{" "}
            {roomState.draftState.pickedAbilities.player1.join(", ")}
          </p>
          <p>
            Player 2 Picks:{" "}
            {roomState.draftState.pickedAbilities.player2.join(", ")}
          </p>
        </div>
      ) : (
        <p>Loading room state...</p>
      )}

      <div className="action-form">
        <h3>Submit an Action</h3>
        <form onSubmit={handleActionSubmit}>
          <select
            value={actionType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setActionType(e.target.value as "ban" | "pick")
            }
          >
            <option value="ban">Ban</option>
            <option value="pick">Pick</option>
          </select>
          <input
            type="text"
            placeholder="Enter ability"
            value={action}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAction(e.target.value)
            }
          />
          <button type="submit">Submit Action</button>
        </form>
      </div>

      <AbilityList roomState={roomState} />
    </div>
  );
};

// Define interfaces for the draft state as provided by the server.
interface DraftState {
  currentPhaseIndex: number;
  bannedAbilities: string[];
  pickedAbilities: {
    player1: string[];
    player2: string[];
  };
}

interface RoomState {
  draftState: DraftState;
}

interface DraftRoomProps {
  roomId: string;
  onLeaveRoom: () => void;
}

export default DraftRoom;
