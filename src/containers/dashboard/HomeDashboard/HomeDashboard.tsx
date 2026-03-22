import styles from "./homeDashboard.module.css";
import Sprints from "../Sprints/sprints";
import BackgroundEffect from "../../../components/BackgroundEffect/backgroundEffect";

import { PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";

type DashboardProps = {
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
  user: {
    teamName: string;
  };
};

type ItemType = {
  itemId: number;
  title: string;
  priority: string;
  status: string;
  positions: { positionId: number; positionName: string; color: string }[];
};

export default function HomeDashboard({
  sprints,
  refreshSprint,
  user,
}: DashboardProps) {
  const [items, setItems] = useState<ItemType[]>([]);

  const total = items.length;

  const completed = items.filter((item) => item.status === "DONE").length;

  const percentage = total > 0 ? (completed / total) * 100 : 0;

  const chartData = [
    { name: "Concluído", value: completed },
    { name: "Restante", value: total - completed },
  ];

  const positionCount: Record<string, { count: number; color: string }> = {};

  items.forEach((item) => {
    item.positions.forEach((pos) => {
      const name = pos.positionName;

      if (positionCount[name]) {
        positionCount[name].count++;
      } else {
        positionCount[name] = {
          count: 1,
          color: pos.color,
        };
      }
    });
  });

  const topPositions = Object.entries(positionCount)
    .map(([name, data]) => ({
      name,
      count: data.count,
      color: data.color,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  async function fetchItems() {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch("http://localhost:8080/items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Erro ao buscar items", error);
    }
  }
  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.backgroundContainer}>
        <BackgroundEffect className={styles.background} />
      </div>
      {user && <h1 className={styles.teamTitle}>{user.teamName}</h1>}
      <Sprints sprints={sprints} refreshSprint={refreshSprint} />
      <section>
        <h1>Gráficos</h1>
        <article className={styles.graphicsContainer}>
          <div
            style={{ gridColumn: "1 / 3" }}
            className={styles.graphicContainer}
          >
            <h2>Desempenho</h2>
          </div>
          <div
            style={{ gridColumn: "3 / 4" }}
            className={`${styles.tasksCompleted} ${styles.graphicContainer}`}
          >
            <h2>Tarefas Concluidas</h2>
            <PieChart width={250} height={250}>
              <Pie
                data={chartData}
                dataKey="value"
                innerRadius={70}
                outerRadius={100}
              >
                <Cell fill="var(--primary-color)" />
                <Cell fill="var(--text-color)" />
              </Pie>

              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: "20px", fontWeight: "bold" }}
              >
                {percentage.toFixed(0)}%
              </text>
            </PieChart>
          </div>
          <div
            style={{ gridColumn: "1 / 2" }}
            className={styles.graphicContainer}
          >
            <h2>Listas Pendentes</h2>
          </div>
          <div
            style={{ gridColumn: "2 / 3" }}
            className={styles.graphicContainer}
          >
            <h2>Status Tarefas</h2>
          </div>
          <div
            style={{ gridColumn: "3 / 4" }}
            className={`${styles.positionsGraphic} ${styles.graphicContainer}`}
          >
            <h2>Cargos Mais Requisitados</h2>
            {topPositions.length === 0 ? (
              <p>Nenhum dado</p>
            ) : (
              <ol>
                {topPositions.map((pos, index) => (
                  <li key={index} className={styles.liPositionsGraphic}>
                    <div className={styles.listContainer}>
                      <div
                        style={{ backgroundColor: pos.color }}
                        className={styles.positionColor}
                      />
                      <p>{pos.name} ({pos.count})</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
