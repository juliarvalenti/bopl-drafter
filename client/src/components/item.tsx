import React from "react";
import { cn } from "../utils";

const Item: React.FC<ItemProps> = ({
  name,
  sprite,
  isBanned,
  pickedPlayer,
  ...rest
}) => (
  <li
    key={`item-${name}`}
    className={cn("item", {
      "item--banned": isBanned,
      "item--picked": !!pickedPlayer,
    })}
    {...rest}
  >
    <img src={sprite} alt={name} className="item-icon" />
    {pickedPlayer && <span>(Picked by {pickedPlayer})</span>}
  </li>
);

interface ItemProps extends React.HTMLProps<HTMLLIElement> {
  name: string;
  sprite: string;
  isBanned?: boolean;
  pickedPlayer?: string | undefined;
}

export default Item;
