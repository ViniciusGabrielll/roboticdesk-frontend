import { useEffect, useState } from "react";
import Sprint from "../../../components/SprintMiniature/sprintMiniature";
import CreateSprint from "../../../components/CreateSprint/createSprint";
import SprintMiniature from "../../../components/SprintMiniature/sprintMiniature";

type SprintType = {
  sprintId: number;
  title: string;
  fromTime: string;
  toTime: string;
  items: {
    itemId: number;
    title: string;
    priority: number;
    positions: { positionName: string }[];
  }[];
};

export default function Sprints() {
  const [sprints, setSprints] = useState<SprintType[]>([]);
  const [showCreateSprint, setShowCreateSprint] = useState(false);

  async function fetchSprints() {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch("http://localhost:8080/sprints", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      const sorted = data.sort(
        (a: SprintType, b: SprintType) =>
          new Date(a.fromTime).getTime() - new Date(b.fromTime).getTime(),
      );

      setSprints(sorted);
    } catch (error) {
      console.error("Erro ao buscar sprints", error);
    }
  }

  useEffect(() => {
    fetchSprints();
  }, []);
  return (
    <div>
      <h1>Sprints</h1>
      {sprints.map((sprint) => (
        <SprintMiniature
          key={sprint.sprintId}
          sprint={sprint}
          refreshSprint={fetchSprints}
        />
      ))}
      <button onClick={() => setShowCreateSprint(!showCreateSprint)}>
        Add Sprint
      </button>
      {showCreateSprint && <CreateSprint onSprintCreated={fetchSprints} />}
    </div>
  );
}
