import { useEffect, useState } from "react";
import Sprint from "../../../components/SprintMiniature/sprintMiniature";
import CreateSprint from "../../../components/CreateSprint/createSprint";
import SprintMiniature from "../../../components/SprintMiniature/sprintMiniature";

type SprintProps = {
  sprints: {
    sprintId: number;
    title: string;
    fromTime: string;
    toTime: string;
    items: {
      itemId: number;
      title: string;
      priority: number;
      status: string;
      positions: { positionName: string }[];
    }[];
  }[];
  refreshSprint: () => void;
};

export default function Sprints({ sprints, refreshSprint }: SprintProps) {
  const [showCreateSprint, setShowCreateSprint] = useState(false);

  return (
    <div>
      <h1>Sprints</h1>
      {sprints.map((sprint) => (
        <SprintMiniature
          key={sprint.sprintId}
          sprint={sprint}
          refreshSprint={refreshSprint}
        />
      ))}
      <button onClick={() => setShowCreateSprint(!showCreateSprint)}>
        Add Sprint
      </button>
      {showCreateSprint && <CreateSprint onSprintCreated={refreshSprint} />}
    </div>
  );
}
