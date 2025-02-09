import React from "react";
import items from "../items";
import { cn } from "../utils";

interface DraftState {
  currentPhaseIndex: number;
  bannedItems: string[];
  pickedItems: {
    player1: string[];
    player2: string[];
  };
}

interface RoomState {
  draftState: DraftState;
}

interface ItemListProps {
  roomState: RoomState | null;
  onItemClick: (itemName: string) => void;
}

const ItemList: React.FC<ItemListProps> = ({ roomState, onItemClick }) => {
  const banned: string[] = roomState ? roomState.draftState.bannedItems : [];
  const pickedP1: string[] = roomState
    ? roomState.draftState.pickedItems.player1
    : [];
  const pickedP2: string[] = roomState
    ? roomState.draftState.pickedItems.player2
    : [];

  return (
    <div className="item-list">
      <h3>Available Items</h3>
      <ul>
        {items.map((item) => {
          const isBanned = banned.includes(item.name);
          const isPicked =
            pickedP1.includes(item.name) || pickedP2.includes(item.name);

          const handleClick = () => {
            if (!isBanned && !isPicked) {
              onItemClick(item.name);
            }
          };

          return (
            <li
              key={`item-${item.name}`}
              className={cn("item", {
                "item--banned": isBanned,
                "item--picked": isPicked,
              })}
              onClick={handleClick}
              style={{
                cursor: isBanned || isPicked ? "not-allowed" : "pointer",
              }}
            >
              <img src={item.sprite} alt={item.name} className="item-icon" />
              {isBanned && <span>(Banned)</span>}
              {pickedP1.includes(item.name) && <span>(Picked by Player1)</span>}
              {pickedP2.includes(item.name) && <span>(Picked by Player2)</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ItemList;
