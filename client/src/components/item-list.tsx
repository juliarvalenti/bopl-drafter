import React from "react";
import items from "../items";
import Item from "./item";

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
            <Item
              key={`item-${item.name}`}
              {...item}
              isBanned={isBanned}
              pickedPlayer={
                pickedP1.includes(item.name)
                  ? "player1"
                  : pickedP2.includes(item.name)
                  ? "player2"
                  : undefined
              }
              onClick={handleClick}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default ItemList;
