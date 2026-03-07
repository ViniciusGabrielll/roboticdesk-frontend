import { useEffect } from "react";
import styles from "./sprint.module.css";

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

export default function Sprint({ sprint, refreshSprint }: SprintProps) {
  useEffect(() => {
    refreshSprint();
  }, []);

  async function changeStatus(itemId: number, status: string) {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `http://localhost:8080/items/${itemId}/status/${status}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const text = await response.text();
        console.error(text);
        throw new Error("Erro ao mudar status do item");
      }

      refreshSprint();
    } catch (error) {
      console.error("Erro ao  mudar status do item", error);
    }
  }

  return (
    <div className={styles.container}>
      <h1>{sprint.title}</h1>
      <div>
        <div>
          <h2>Para Fazer</h2>
          {sprint.items
            .filter((item) => item.status === "TODO")
            .map((item) => (
              <div key={item.itemId}>
                <p>{item.title}</p>
                {item.positions.map((position, index) => (
                  <p key={index}>{position.positionName}</p>
                ))}
                <button onClick={() => changeStatus(item.itemId, "DOING")}>
                  Avançar
                </button>
              </div>
            ))}
        </div>
        <div>
          <h2>Em Progresso</h2>
          {sprint.items
            .filter((item) => item.status === "DOING")
            .map((item) => (
              <div key={item.itemId}>
                <p>{item.title}</p>
                {item.positions.map((position, index) => (
                  <p key={index}>{position.positionName}</p>
                ))}
                <button onClick={() => changeStatus(item.itemId, "TODO")}>
                  Voltar
                </button>
                <button onClick={() => changeStatus(item.itemId, "DONE")}>
                  Avançar
                </button>
              </div>
            ))}
        </div>
        <div>
          <h2>Feito</h2>
          {sprint.items
            .filter((item) => item.status === "DONE")
            .map((item) => (
              <div key={item.itemId}>
                <p>{item.title}</p>
                {item.positions.map((position, index) => (
                  <p key={index}>{position.positionName}</p>
                ))}
                <button onClick={() => changeStatus(item.itemId, "DOING")}>
                  Voltar
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
