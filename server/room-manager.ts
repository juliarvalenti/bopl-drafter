import { Socket } from "socket.io";

// Define our two possible player roles.
type Player = "player1" | "player2";

// Each phase specifies the action type, how many actions are allowed in that phase,
// and which player is allowed to act.
interface DraftPhase {
  type: "ban" | "pick";
  actionsAllowed: number;
  allowedPlayer: Player;
}

// The overall draft state keeps track of banned abilities,
// each player's picks, and the progress through the draft sequence.
interface DraftState {
  bannedItems: string[];
  pickedItems: { [key in Player]: string[] };
  currentPhaseIndex: number;
  actionsPerformedInPhase: number;
  draftSequence: DraftPhase[];
  timeline: TimelineItem[];
}

interface TimelineItem {
  type: "ban" | "pick";
  ability: string;
  player: Player;
}

// A Room contains a unique ID, a list of connected users,
// a mapping of socket IDs to player roles, and the draft state.
interface Room {
  id: string;
  users: { [socketId: string]: any };
  playerAssignment: { [socketId: string]: Player };
  draftState: DraftState;
}

// In-memory storage for all active rooms.
const rooms: Map<string, Room> = new Map();

/**
 * Joins a user to a room.
 * If the room does not exist, it creates a new room with the predefined draft sequence.
 * For two players, the first is assigned 'player1' and the second 'player2'.
 */
function joinRoom(roomId: string, socket: Socket, userData: any): void {
  let room = rooms.get(roomId);
  if (!room) {
    room = {
      id: roomId,
      users: {},
      playerAssignment: {},
      draftState: {
        bannedItems: [],
        pickedItems: { player1: [], player2: [] },
        currentPhaseIndex: 0,
        actionsPerformedInPhase: 0,
        // Define the snake draft sequence:
        draftSequence: [
          { type: "ban", actionsAllowed: 1, allowedPlayer: "player1" }, // Player 1 bans one
          { type: "ban", actionsAllowed: 2, allowedPlayer: "player2" }, // Player 2 bans two
          { type: "ban", actionsAllowed: 2, allowedPlayer: "player1" }, // Player 1 bans two
          { type: "ban", actionsAllowed: 1, allowedPlayer: "player2" }, // Player 2 bans one
          { type: "pick", actionsAllowed: 1, allowedPlayer: "player2" }, // Player 2 picks one
          { type: "pick", actionsAllowed: 2, allowedPlayer: "player1" }, // Player 1 picks two
          { type: "pick", actionsAllowed: 2, allowedPlayer: "player2" }, // Player 2 picks two
          { type: "pick", actionsAllowed: 1, allowedPlayer: "player1" }, // Player 1 picks one
        ],
        timeline: [],
      },
    };
    rooms.set(roomId, room);
  }
  // Assign the player role if not already assigned.
  if (!room.playerAssignment[socket.id]) {
    const currentPlayers = Object.values(room.playerAssignment);
    let assigned: Player;
    if (currentPlayers.length === 0) {
      assigned = "player1";
    } else if (currentPlayers.length === 1) {
      assigned = "player2";
    } else {
      // For simplicity, only allow two players.
      throw new Error("Room is full");
    }
    room.playerAssignment[socket.id] = assigned;
  }
  // Add or update the user in the room.
  room.users[socket.id] = userData;
}

/**
 * Retrieves the raw room state.
 */
function getRoomState(roomId: string): Room | null {
  return rooms.get(roomId) || null;
}

/**
 * Data structure for a draft action sent from a client.
 */
interface DraftActionData {
  roomId: string;
  action: "ban" | "pick";
  ability: string;
}

/**
 * Processes a draft action.
 * Checks whether the acting player (determined by the socket) is allowed to take the action
 * according to the current draft phase, records the action, and advances the phase when appropriate.
 */
function processDraftAction(
  data: DraftActionData,
  socket: Socket
): Room | null {
  const room = rooms.get(data.roomId);
  if (!room) return null;

  const player = room.playerAssignment[socket.id];
  if (!player) return room; // In a full app, you might send an error back.

  const { draftState } = room;
  const currentPhase = draftState.draftSequence[draftState.currentPhaseIndex];

  // Check that the action type matches the current phase.
  if (data.action !== currentPhase.type) {
    console.log(
      `Action type mismatch: expected ${currentPhase.type}, received ${data.action}`
    );
    return room;
  }

  // Ensure the player acting is the one allowed for this phase.
  if (player !== currentPhase.allowedPlayer) {
    console.log(
      `Player ${player} is not allowed to perform this action; allowed: ${currentPhase.allowedPlayer}`
    );
    return room;
  }

  // Process the action.
  if (data.action === "ban") {
    if (!draftState.bannedItems.includes(data.ability)) {
      draftState.bannedItems.push(data.ability);
    }
  } else if (data.action === "pick") {
    draftState.pickedItems[player].push(data.ability);
  }

  if (!draftState.timeline) {
    draftState.timeline = [];
  }
  draftState.timeline.push({
    type: data.action,
    ability: data.ability,
    player,
  });

  // Increment the count of actions performed in the current phase.
  draftState.actionsPerformedInPhase += 1;
  // If the allowed number of actions is reached, move to the next phase.
  if (draftState.actionsPerformedInPhase >= currentPhase.actionsAllowed) {
    draftState.currentPhaseIndex += 1;
    draftState.actionsPerformedInPhase = 0;
  }

  return room;
}

/**
 * Removes a user from any room they're in.
 * If a room becomes empty, it is removed.
 */
function removeUser(socket: Socket): void {
  rooms.forEach((room, roomId) => {
    if (room.users[socket.id]) {
      delete room.users[socket.id];
      delete room.playerAssignment[socket.id];
      if (Object.keys(room.users).length === 0) {
        rooms.delete(roomId);
      }
    }
  });
}

/**
 * Interface for a player's details.
 */
interface PlayerDetails {
  socketId: string;
  role: Player;
  userData: any;
}

/**
 * Interface for detailed room information.
 */
interface RoomDetails {
  id: string;
  players: PlayerDetails[];
  draftState: DraftState;
  currentTurnPlayer?: Player;
}

/**
 * Returns detailed information about a room including:
 * - List of players (with their roles and user data)
 * - The current allowed player (based on the draft phase)
 */
function getRoomDetails(roomId: string): RoomDetails | null {
  const room = rooms.get(roomId);
  if (!room) return null;
  const players: PlayerDetails[] = Object.entries(room.playerAssignment).map(
    ([socketId, role]) => ({
      socketId,
      role,
      userData: room.users[socketId],
    })
  );
  const currentPhase =
    room.draftState.draftSequence[room.draftState.currentPhaseIndex];
  const currentTurnPlayer = currentPhase
    ? currentPhase.allowedPlayer
    : undefined;
  return {
    id: room.id,
    players,
    draftState: room.draftState,
    currentTurnPlayer,
  };
}

export default {
  joinRoom,
  getRoomState,
  processDraftAction,
  removeUser,
  getRoomDetails,
};
