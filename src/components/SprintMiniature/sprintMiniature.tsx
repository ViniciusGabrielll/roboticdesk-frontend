import { useState } from "react";
import Sprint from "../Sprint/sprint";
import styles from "./sprintMiniature.module.css";

type SprintProps = {
  sprint: {
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
  };
  refreshSprint: () => void;
};

export default function SprintMiniature({
  sprint,
  refreshSprint,
}: SprintProps) {
  const [showSprint, setShowSprint] = useState(false);

  async function deleteSprint() {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `http://localhost:8080/sprints/${sprint.sprintId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao deletar sprint");
      }

      refreshSprint();
    } catch (error) {
      console.error("Erro ao deletar sprint", error);
    }
  }

  return (
    <div>
      <button onClick={() => setShowSprint(!showSprint)}>
        <p>{sprint.title}</p>
        <p>De: {sprint.fromTime}</p>
        <p>Para: {sprint.toTime}</p>
      </button>
      <button onClick={deleteSprint}>Delete</button>
      {showSprint && (
        <button
          onClick={() => setShowSprint(!showSprint)}
          className={styles.backBtn}
        >
          Voltar
        </button>
      )}
      {showSprint && <Sprint sprint={sprint} refreshSprint={refreshSprint}/>}
    </div>
  );
}
