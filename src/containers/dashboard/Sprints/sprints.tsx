import { useEffect, useState } from "react";
import Sprint from "../../../components/Sprint/sprint";
import CreateSprint from "../../../components/CreateSprint/createSprint";

type SprintType = {
  id: number;
  title: string;
  fromTime: string;
  toTime: string;
};

export default function Sprints() {
  const [sprints, setSprints] = useState<SprintType[]>([]);
  const [showCreateSprint, setShowCreateSprint] = useState(false);

  async function fetchItems() {
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
    fetchItems();
  }, []);
  return (
    <div>
      <h1>Sprints</h1>
      {sprints.map((sprint, index) => (
        <Sprint key={sprint.id} sprint={sprint} order={index + 1}/>
      ))}
      <button onClick={() => setShowCreateSprint(!showCreateSprint)}>Add Sprint</button>
      {showCreateSprint && <CreateSprint onSprintCreated={fetchItems} />}
    </div>
  );
}
