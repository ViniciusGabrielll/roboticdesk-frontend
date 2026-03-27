import { useState } from "react";
import styles from "./sprints.module.css";
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
      priority: string;
      status: string;
      positions: { positionName: string }[];
    }[];
  }[];
  refreshSprint: () => void;
};

export default function Sprints({ sprints, refreshSprint }: SprintProps) {
  const [showCreateSprint, setShowCreateSprint] = useState(false);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  }

  function addOneDay(date: string) {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    return d;
  }

  return (
    <section className={styles.container}>
      <h1>Sprints</h1>
      <article className={styles.sprints}>
        {sprints.map((sprint, index) => {
          const isFirst = index === 0;
          const isLast = index === sprints.length - 1;
          return (
            <div className={styles.containerSprint}>
              {isFirst && (
                <span className={styles.startDate}>
                  Início: {formatDate(addOneDay(sprint.fromTime).toISOString())}
                </span>
              )}
              <SprintMiniature
                key={sprint.sprintId}
                sprint={sprint}
                refreshSprint={refreshSprint}
              />
              {isLast && (
                <span className={styles.endDate}>
                  Fim: {formatDate(addOneDay(sprint.toTime).toISOString())}
                </span>
              )}
            </div>
          );
        })}
        <button
          onClick={() => setShowCreateSprint(!showCreateSprint)}
          className={styles.addSprint}
        >
          +
        </button>
        {showCreateSprint && (
          <CreateSprint
            onSprintCreated={refreshSprint}
            backButton={() => setShowCreateSprint(false)}
          />
        )}
      </article>
    </section>
  );
}
