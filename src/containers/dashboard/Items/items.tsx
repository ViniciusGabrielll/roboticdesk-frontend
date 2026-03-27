import { useEffect, useState } from "react";
import styles from "./items.module.css";
import CreateItem from "../../../components/CreateItem/createItem";
import BackgroundEffect from "../../../components/BackgroundEffect/backgroundEffect";
import check from "../../../assets/images/icons/check.png"

type ItemType = {
  itemId: number;
  title: string;
  priority: string;
  status: string;
  positions: { positionId: number; positionName: string; color: string }[];
};

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
      positions: { positionId: number; positionName: string; color: string }[];
    }[];
  }[];
  refreshSprint: () => void;
};

export default function Items({ sprints, refreshSprint }: SprintProps) {
  const [items, setItems] = useState<ItemType[]>([]);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [filter, setFilter] = useState("all");

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

  const filteredItems = items.filter((item) => {
    if (filter === "completed") {
      return item.status === "DONE";
    }

    if (filter === "notCompleted") {
      return item.status !== "DONE";
    }

    return true;
  });

  const criticalItems = filteredItems.filter(
    (item) => item.priority === "CRITICAL",
  );

  const importantItems = filteredItems.filter(
    (item) => item.priority === "IMPORTANT",
  );

  const optionalItems = filteredItems.filter(
    (item) => item.priority === "OPTIONAL",
  );

  async function assignItemToSprint(itemId: number, sprintId: string) {
    const token = localStorage.getItem("accessToken");

    await fetch(`http://localhost:8080/sprints/${sprintId}/items/${itemId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    refreshSprint();
    fetchItems();
  }

  async function deleteItem(e: React.MouseEvent, itemId: number) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`http://localhost:8080/items/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar item");
      }

      fetchItems();
      refreshSprint();
    } catch (error) {
      console.error("Erro ao deletar item", error);
    }
  }

  function renderItems(list: ItemType[]) {
    return list.map((item) => {
      const sprintDoItem = sprints.find((sprint) =>
        sprint.items.some((i) => i.itemId === item.itemId),
      );
      const isCompleted = item.status === "DONE";

      return (
        <div
          key={item.itemId}
          className={`${styles.itemContainer} ${
            isCompleted ? styles.completed : ""
          }`}
        >
          <ul className={styles.positionsContainer}>
            {item.positions.map((position, index) => (
              <li key={index} className={styles.positionContainer}>
                <div
                  className={styles.positionColor}
                  style={{ backgroundColor: position.color }}
                ></div>
                <p>{position.positionName}</p>
              </li>
            ))}
          </ul>
          <p>|</p>
          <p>{item.title}</p>

          <select
            value={sprintDoItem?.sprintId || ""}
            onChange={(e) => assignItemToSprint(item.itemId, e.target.value)}
            className={styles.optionSprint}
          >
            <option value=""></option>
            {sprints.map((sprint) => (
              <option key={sprint.sprintId} value={sprint.sprintId}>
                {sprint.title}
              </option>
            ))}
          </select>

          {isCompleted && (
            <img src={check} alt="completed" className={styles.check} />
          )}

          <button
            className={styles.deleteBtn}
            onClick={(e) => deleteItem(e, item.itemId)}
          >
            x
          </button>
        </div>
      );
    });
  }

  return (
    <section className={styles.container}>
      <h1>Tarefas</h1>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className={styles.selectTasks}
      >
        <option value="all">Todas</option>
        <option value="completed">Concluídas</option>
        <option value="notCompleted">Não concluídas</option>
      </select>
      <div className={styles.backgroundContainer}>
        <BackgroundEffect className={styles.background} />
      </div>
      <article>
        <button
          onClick={() => setShowCreateItem(!showCreateItem)}
          className={styles.addItem}
        >
          +
        </button>
        {showCreateItem && (
          <CreateItem
            onItemCreated={fetchItems}
            backButton={() => setShowCreateItem(false)}
          />
        )}
        <div className={styles.itemsContainer}>
          {criticalItems.length > 0 && (
            <div className={styles.critical}>
              <h2>Críticos</h2>
              <div className={styles.itemsSection}>
                {renderItems(criticalItems)}
              </div>
            </div>
          )}

          {importantItems.length > 0 && (
            <div className={styles.important}>
              <h2>Importantes</h2>
              <div className={styles.itemsSection}>
                {renderItems(importantItems)}
              </div>
            </div>
          )}

          {optionalItems.length > 0 && (
            <div className={styles.optional}>
              <h2>Opcionais</h2>
              <div className={styles.itemsSection}>
                {renderItems(optionalItems)}
              </div>
            </div>
          )}
        </div>
      </article>
    </section>
  );
}
