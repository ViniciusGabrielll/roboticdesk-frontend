import { useEffect } from "react";
import styles from "./sprint.module.css";
import { useParams } from "react-router-dom";

type SprintType = {
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

type SprintProps = {
  sprints: SprintType[];
  refreshSprint: () => void;
};

export default function Sprint({ sprints, refreshSprint }: SprintProps) {
  const { sprintId } = useParams();
  const sprint = sprints.find((s) => s.sprintId === Number(sprintId));

  useEffect(() => {
    refreshSprint();
  }, []);

  if (!sprint) {
    return <p>Carregando...</p>;
  }

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
    <section className={styles.section}>
      <h1>{sprint.title}</h1>
      <div className={styles.container}>
        <article>
          <h2>Para Fazer</h2>
          {sprint.items
            .filter((item) => item.status === "TODO")
            .map((item) => (
              <div key={item.itemId} className={styles.itemContainer}>
                <p>{item.title}</p>
                {item.positions.map((position, index) => (
                  <p key={index}>{position.positionName}</p>
                ))}
                <button onClick={() => changeStatus(item.itemId, "DOING")} className={styles.passBtn}>
                  &gt;
                </button>
              </div>
            ))}
        </article>
        <article>
          <h2>Em Progresso</h2>
          {sprint.items
            .filter((item) => item.status === "DOING")
            .map((item) => (
              <div key={item.itemId} className={styles.itemContainer}>
                <p>{item.title}</p>
                {item.positions.map((position, index) => (
                  <p key={index}>{position.positionName}</p>
                ))}
                <button onClick={() => changeStatus(item.itemId, "TODO")} className={styles.backBtn}>
                  &lt;
                </button>
                <button onClick={() => changeStatus(item.itemId, "DONE")} className={styles.passBtn}>
                  &gt;
                </button>
              </div>
            ))}
        </article>
        <article>
          <h2>Feito</h2>
          {sprint.items
            .filter((item) => item.status === "DONE")
            .map((item) => (
              <div key={item.itemId} className={styles.itemContainer}>
                <p>{item.title}</p>
                {item.positions.map((position, index) => (
                  <p key={index}>{position.positionName}</p>
                ))}
                <button onClick={() => changeStatus(item.itemId, "DOING")} className={styles.backBtn}>
                  &lt;
                </button>
              </div>
            ))}
        </article>
      </div>
    </section>
  );
}
