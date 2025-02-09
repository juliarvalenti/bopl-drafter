import React from "react";
import items from "../items";

const ItemList: React.FC<ItemListProps> = ({ roomState }) => {
  const banned: string[] = roomState ? roomState.draftState.bannedItems : [];
  const pickedP1: string[] = roomState
    ? roomState.draftState.pickedItems.player1
    : [];
  const pickedP2: string[] = roomState
    ? roomState.draftState.pickedItems.player2
    : [];

  return (
    <div className="ability-list">
      <h3>Available Items</h3>
      <ul>
        {items.map((item) => (
          <li key={`item-${item.name}`}>
            <img src={item.sprite} alt={item.name} />
            {banned.includes(item.name) && <span>(Banned)</span>}
            {pickedP1.includes(item.name) && <span>(Picked by Player1)</span>}
            {pickedP2.includes(item.name) && <span>(Picked by Player2)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Define the draft state interface.
interface DraftState {
  currentPhaseIndex: number;
  bannedItems: string[];
  pickedItems: {
    player1: string[];
    player2: string[];
  };
}

// Define the room state interface.
interface RoomState {
  draftState: DraftState;
}

// Define the props for AbilityList.
interface ItemListProps {
  roomState: RoomState | null;
}

export default ItemList;
