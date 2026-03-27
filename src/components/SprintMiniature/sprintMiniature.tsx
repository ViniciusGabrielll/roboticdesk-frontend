import styles from "./sprintMiniature.module.css";
import { Link } from "react-router-dom";
import check from "../../assets/images/icons/check.png";

type SprintProps = {
  sprint: {
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
  };
  refreshSprint: () => void;
};

export default function SprintMiniature({
  sprint,
  refreshSprint,
}: SprintProps) {
  const isCompleted =
    sprint.items.length > 0 &&
    sprint.items.every((item) => item.status === "DONE");

  function isSprintToday(from: string, to: string) {
    const today = new Date();
    const start = new Date(from);
    const end = new Date(to);

    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    return today >= start && today <= end;
  }

  const isTodaySprint = isSprintToday(sprint.fromTime, sprint.toTime);

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

  async function deleteSprint(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
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
    <Link
      to={`/dashboard/sprints/${sprint.sprintId}`}
      className={`${styles.sprint}
        ${isCompleted ? styles.completedSprint : ""}
        ${isTodaySprint ? styles.todaySprint : ""}
      `}
    >
      {isCompleted && (
        <img src={check} alt="completed" className={styles.check} />
      )}
      <h3>{sprint.title}</h3>
      <p>De: {formatDate(addOneDay(sprint.fromTime).toISOString())}</p>
      <p>Para: {formatDate(addOneDay(sprint.toTime).toISOString())}</p>
      <button onClick={deleteSprint} className={styles.deleteBtn}>
        x
      </button>
    </Link>
  );
}
