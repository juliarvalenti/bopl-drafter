// /client/src/components/draft-room.tsx
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import ItemList from "./item-list";
import ItemSection from "./item-section";

// Use localhost for development.
const SOCKET_SERVER_URL = "http://localhost:3000";

const DraftRoom: React.FC<DraftRoomProps> = ({ roomId, onLeaveRoom }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [myPlayer, setMyPlayer] = useState<PlayerDetails | null>(null);

  useEffect(() => {
    const newSocket: Socket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected, socket id:", newSocket.id);
      newSocket.emit("joinRoom", roomId, { username: "User" });
    });

    newSocket.on("roomUpdate", (updatedRoom: RoomDetails) => {
      console.log("Received roomUpdate:", updatedRoom);
      setRoomDetails(updatedRoom);
      const me = updatedRoom.players.find(
        (player) => player.socketId === newSocket.id
      );
      setMyPlayer(me || null);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  // Determine allowed action type from the current draft phase.
  const allowedActionType =
    roomDetails &&
    roomDetails.draftState.draftSequence[
      roomDetails.draftState.currentPhaseIndex
    ]?.type;

  // This callback is passed to ItemList; it automatically emits the action using the allowed action type.
  const handleItemClick = (itemName: string) => {
    if (!socket || !roomDetails || !myPlayer) return;
    if (roomDetails.currentTurnPlayer !== myPlayer.role) {
      console.log("Not your turn.");
      return;
    }
    if (allowedActionType) {
      console.log(`Emitting action: ${allowedActionType} for item ${itemName}`);
      socket.emit("draftAction", {
        roomId,
        action: allowedActionType,
        ability: itemName,
      });
    }
  };

  return (
    <div className="draft-room">
      <ItemList
        roomState={roomDetails ? { draftState: roomDetails.draftState } : null}
        onItemClick={handleItemClick}
      />
      <div>
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
                    {player.userData.username || player.socketId} -{" "}
                    {player.role}{" "}
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
                Banned Abilities
                <ItemSection items={roomDetails.draftState.bannedItems} />
              </p>
              <p>
                Player 1 Picks:{" "}
                <ItemSection
                  items={roomDetails.draftState.pickedItems.player1}
                />
              </p>
              <p>
                Player 2 Picks:{" "}
                <ItemSection
                  items={roomDetails.draftState.pickedItems.player2}
                />
              </p>
            </div>
            {myPlayer && (
              <div className="my-identity">
                <p>
                  You are: {myPlayer.userData.username || myPlayer.socketId} -{" "}
                  {myPlayer.role}
                </p>
                {roomDetails.currentTurnPlayer === myPlayer.role ? (
                  <p>
                    <strong>
                      It's your turn to{" "}
                      {allowedActionType === "ban" ? "ban" : "pick"} an item.
                    </strong>
                  </p>
                ) : (
                  <p>Wait for your turn.</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <p>Loading room details...</p>
        )}
      </div>
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
  draftSequence: {
    type: "ban" | "pick";
    actionsAllowed: number;
    allowedPlayer: "player1" | "player2";
  }[];
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
