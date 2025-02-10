import React from "react";
import items from "../items";

export interface TimelineItem {
  type: "ban" | "pick";
  ability: string;
  player: "player1" | "player2";
}

interface DraftTimelineProps {
  actions: TimelineItem[];
}

const DraftTimeline: React.FC<DraftTimelineProps> = ({ actions }) => {
  // Lookup an item’s sprite by matching its name.
  const getItemSprite = (ability: string): string | null => {
    const found = items.find((item) => item.name === ability);
    return found ? found.sprite : null;
  };

  return (
    <div className="draft-timeline">
      <div className="timeline-container">
        {/* Vertical center line */}
        <div className="timeline-line"></div>
        {actions.map((action, index) => {
          const sprite = getItemSprite(action.ability);
          // Determine alignment class based on player:
          const alignmentClass =
            action.player === "player1"
              ? "timeline-item--left"
              : "timeline-item--right";
          return (
            <div key={index} className={`timeline-item ${alignmentClass}`}>
              <div className="timeline-content">
                <div className="timeline-arrow" />
                <div className="timeline-box">
                  {sprite && (
                    <img
                      src={sprite}
                      alt={action.ability}
                      className="timeline-icon"
                    />
                  )}
                  <span className="timeline-text">
                    {action.ability}{" "}
                    {action.type === "ban" ? "Banned" : "Picked"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DraftTimeline;
