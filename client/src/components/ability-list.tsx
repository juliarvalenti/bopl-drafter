import React from "react";

const availableAbilities: string[] = [
  "Shrink Ray",
  "Growth Ray",
  "Time Stop",
  "Black Hole",
  "Rocket Engine",
  "Flammable Smoke",
];

const AbilityList: React.FC<AbilityListProps> = ({ roomState }) => {
  const banned: string[] = roomState
    ? roomState.draftState.bannedAbilities
    : [];
  const pickedP1: string[] = roomState
    ? roomState.draftState.pickedAbilities.player1
    : [];
  const pickedP2: string[] = roomState
    ? roomState.draftState.pickedAbilities.player2
    : [];

  return (
    <div className="ability-list">
      <h3>Available Abilities</h3>
      <ul>
        {availableAbilities.map((ability) => (
          <li key={ability}>
            {ability} {banned.includes(ability) && <span>(Banned)</span>}
            {pickedP1.includes(ability) && <span>(Picked by Player1)</span>}
            {pickedP2.includes(ability) && <span>(Picked by Player2)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Define the draft state interface.
interface DraftState {
  currentPhaseIndex: number;
  bannedAbilities: string[];
  pickedAbilities: {
    player1: string[];
    player2: string[];
  };
}

// Define the room state interface.
interface RoomState {
  draftState: DraftState;
}

// Define the props for AbilityList.
interface AbilityListProps {
  roomState: RoomState | null;
}

export default AbilityList;
