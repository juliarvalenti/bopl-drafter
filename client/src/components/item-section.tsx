import React from "react";
import itemsComponents from "../items";
import Item from "./item";

const ItemSection: React.FC<ItemSectionProps> = ({ items }) => {
  const itemsAsComponents = items.map((item) => {
    const ItemComponent = itemsComponents.find(
      (component) => component.name === item
    );
    if (!ItemComponent) {
      console.error(`Item ${item} does not have a corresponding component.`);
      return null;
    }
    return ItemComponent;
  }) as unknown as { name: string; sprite: string }[];

  return (
    <section id="item-section">
      <ul>
        {itemsAsComponents.map((item) => (
          <li key={item.name}>
            <Item {...item} />
          </li>
        ))}
      </ul>
    </section>
  );
};

interface ItemSectionProps {
  items: string[];
}

export default ItemSection;
