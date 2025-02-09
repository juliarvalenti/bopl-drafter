// /client/src/components/draft-room.tsx
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import AbilityList from "./ability-list";

// Replace with your actual Heroku server URL.
const SOCKET_SERVER_URL = "http://localhost:3000";

const DraftRoom: React.FC<DraftRoomProps> = ({ roomId, onLeaveRoom }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [myPlayer, setMyPlayer] = useState<PlayerDetails | null>(null);
  const [action, setAction] = useState<string>("");
  const [actionType, setActionType] = useState<"ban" | "pick">("ban");

  useEffect(() => {
    // Initialize the Socket.IO client.
    const newSocket: Socket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Tell the server to join the specified room.
    newSocket.emit("joinRoom", roomId, { username: "User" }); // Replace with real user data.

    // Listen for detailed room state updates.
    newSocket.on("roomUpdate", (updatedRoom: RoomDetails) => {
      setRoomDetails(updatedRoom);
      // Determine my identity by comparing my socket id to the room's players.
      const me = updatedRoom.players.find(
        (player) => player.socketId === newSocket.id
      );
      setMyPlayer(me || null);
    });

    // Clean up when component unmounts.
    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  const handleActionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (socket && action.trim() !== "") {
      // Emit a draft action with roomId, action type, and the ability.
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

      {roomDetails ? (
        <div className="room-details">
          <h3>Room Details</h3>
          <div className="players-list">
            <h4>Players:</h4>
            <ul>
              {roomDetails.players.map((player) => (
                <li key={player.socketId}>
                  {player.userData.username || player.socketId} - {player.role}{" "}
                  {roomDetails.currentTurnPlayer === player.role && (
                    <strong>(Current Turn)</strong>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="draft-state">
            <h4>Draft State</h4>
            <p>Current Phase: {roomDetails.draftState.currentPhaseIndex}</p>
            <p>
              Banned Abilities:{" "}
              {roomDetails.draftState.bannedAbilities.join(", ")}
            </p>
            <p>
              Player 1 Picks:{" "}
              {roomDetails.draftState.pickedAbilities.player1.join(", ")}
            </p>
            <p>
              Player 2 Picks:{" "}
              {roomDetails.draftState.pickedAbilities.player2.join(", ")}
            </p>
          </div>
          {myPlayer && (
            <div className="my-identity">
              <p>
                You are: {myPlayer.userData.username || myPlayer.socketId} -{" "}
                {myPlayer.role}
              </p>
              {roomDetails.currentTurnPlayer === myPlayer.role && (
                <p>
                  <strong>It's your turn!</strong>
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <p>Loading room details...</p>
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

      <AbilityList
        roomState={roomDetails ? { draftState: roomDetails.draftState } : null}
      />
    </div>
  );
};

interface DraftState {
  currentPhaseIndex: number;
  bannedAbilities: string[];
  pickedAbilities: {
    player1: string[];
    player2: string[];
  };
}

interface PlayerDetails {
  socketId: string;
  role: "player1" | "player2";
  userData: { username?: string; [key: string]: unknown };
}

interface RoomDetails {
  id: string;
  players: PlayerDetails[];
  draftState: DraftState;
  currentTurnPlayer?: "player1" | "player2";
}

interface DraftRoomProps {
  roomId: string;
  onLeaveRoom: () => void;
}

export default DraftRoom;
