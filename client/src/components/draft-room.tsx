import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import ItemList from "./item-list";

// Use your local server URL for development.
const SOCKET_SERVER_URL = "http://localhost:3000";

const DraftRoom: React.FC<DraftRoomProps> = ({ roomId, onLeaveRoom }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [myPlayer, setMyPlayer] = useState<PlayerDetails | null>(null);
  const [actionType, setActionType] = useState<"ban" | "pick">("ban");

  useEffect(() => {
    const newSocket: Socket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Emit joinRoom only after the connection is established.
    newSocket.on("connect", () => {
      console.log("Connected, socket id:", newSocket.id);
      newSocket.emit("joinRoom", roomId, { username: "User" });
    });

    newSocket.on("roomUpdate", (updatedRoom: RoomDetails) => {
      setRoomDetails(updatedRoom);
      // Determine your own player details using the socket id.
      const me = updatedRoom.players.find(
        (player) => player.socketId === newSocket.id
      );
      setMyPlayer(me || null);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  const handleItemClick = (itemName: string) => {
    if (socket) {
      socket.emit("draftAction", {
        roomId,
        action: actionType,
        ability: itemName,
      });
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
              Banned Abilities: {roomDetails.draftState.bannedItems.join(", ")}
            </p>
            <p>
              Player 1 Picks:{" "}
              {roomDetails.draftState.pickedItems.player1.join(", ")}
            </p>
            <p>
              Player 2 Picks:{" "}
              {roomDetails.draftState.pickedItems.player2.join(", ")}
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

      <div className="action-controls">
        <h3>Select Action Type</h3>
        <select
          value={actionType}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setActionType(e.target.value as "ban" | "pick")
          }
        >
          <option value="ban">Ban</option>
          <option value="pick">Pick</option>
        </select>
      </div>

      {/* Render the ItemList with the onItemClick callback */}
      <ItemList
        roomState={roomDetails ? { draftState: roomDetails.draftState } : null}
        onItemClick={handleItemClick}
      />
    </div>
  );
};

interface DraftState {
  currentPhaseIndex: number;
  bannedItems: string[];
  pickedItems: {
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
