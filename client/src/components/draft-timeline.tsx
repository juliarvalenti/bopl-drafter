// /client/src/components/draft-timeline.tsx
import React from "react";

interface DraftTimelineProps {
  actions: TimelineItem[];
}

const DraftTimeline: React.FC<DraftTimelineProps> = ({ actions }) => {
  return (
    <div className="draft-timeline">
      <h4>Draft Timeline</h4>
      <ul>
        {actions.map((action, index) => (
          <li
            key={index}
            className={`timeline-item timeline-item--${action.type} timeline-item--${action.player}`}
          >
            {action.ability} {action.type === "ban" ? "Banned" : "Picked"} by{" "}
            {action.player}
          </li>
        ))}
      </ul>
    </div>
  );
};

export interface TimelineItem {
  type: "ban" | "pick";
  ability: string;
  player: "player1" | "player2";
}

export default DraftTimeline;
