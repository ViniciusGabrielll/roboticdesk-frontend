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
    priority: string;
    status: string;
    positions: { positionId: number; positionName: string; color: string }[];
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

  const statusFlow = {
    TODO: { next: "DOING", prev: null },
    DOING: { next: "DONE", prev: "TODO" },
    DONE: { next: null, prev: "DOING" },
  } as const;

  const groupedByStatus = groupByStatus(sprint.items);

  function groupByPriority(items: SprintType["items"]) {
    return {
      CRITICAL: items.filter((i) => i.priority === "CRITICAL"),
      IMPORTANT: items.filter((i) => i.priority === "IMPORTANT"),
      OPTIONAL: items.filter((i) => i.priority === "OPTIONAL"),
    };
  }

  const priorities = [
    { key: "CRITICAL", style: "critical"},
    { key: "IMPORTANT", style: "important"
    },
    { key: "OPTIONAL", style: "optional"},
  ] as const;

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

  function groupByStatus(items: SprintType["items"]) {
    return items.reduce(
      (acc, item) => {
        acc[item.status as keyof typeof acc].push(item);
        return acc;
      },
      {
        TODO: [] as SprintType["items"],
        DOING: [] as SprintType["items"],
        DONE: [] as SprintType["items"],
      },
    );
  }

  function getNextStatus(status: string) {
    if (status === "TODO") return "DOING";
    if (status === "DOING") return "DONE";
    return null;
  }

  function getPrevStatus(status: string) {
    if (status === "DONE") return "DOING";
    if (status === "DOING") return "TODO";
    return null;
  }

  function renderColumn(
    items: SprintType["items"],
    status: keyof typeof statusFlow,
  ) {
    const grouped = groupByPriority(items);

    return priorities.map((p) => {
      const list = grouped[p.key];

      if (list.length === 0) return null;

      return (
        <div key={p.key} className={`${styles.itemsPriority} ${styles[p.style]}`}>

          {list.map((item) => {
            const { next, prev } = statusFlow[status];

            return (
              <div key={item.itemId} className={styles.itemContainer}>
                {/* posições */}
                {item.positions.map((position, index) => (
                  <div
                    key={index}
                    style={{ backgroundColor: position.color }}
                    className={styles.positionCircle}
                  ></div>
                ))}

                <p>|</p>
                <p>{item.title}</p>

                {/* voltar */}
                {prev && (
                  <button
                    onClick={() => changeStatus(item.itemId, prev)}
                    className={styles.backBtn}
                  >
                    &lt;
                  </button>
                )}

                {/* avançar */}
                {next && (
                  <button
                    onClick={() => changeStatus(item.itemId, next)}
                    className={styles.passBtn}
                  >
                    &gt;
                  </button>
                )}
              </div>
            );
          })}
        </div>
      );
    });
  }

  return (
    <section>
      <h1>{sprint.title}</h1>

      <div className={styles.container}>
        <article>
          <h2 className={styles.titleItemsContainer}>Para Fazer</h2>
          {renderColumn(groupedByStatus.TODO, "TODO")}
        </article>

        <article>
          <h2 className={styles.titleItemsContainer}>Em Progresso</h2>
          {renderColumn(groupedByStatus.DOING, "DOING")}
        </article>

        <article>
          <h2 className={styles.titleItemsContainer}>Feito</h2>
          {renderColumn(groupedByStatus.DONE, "DONE")}
        </article>
      </div>
    </section>
  );
}
