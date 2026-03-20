import { useEffect, useState } from "react";
import styles from "./items.module.css";
import CreateItem from "../../../components/CreateItem/createItem";

type ItemType = {
  itemId: number;
  title: string;
  priority: number;
  status: string;
  positions: { positionName: string }[];
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
      priority: number;
      status: string;
      positions: { positionName: string }[];
    }[];
  }[];
  refreshSprint: () => void;
};

export default function Items({ sprints, refreshSprint }: SprintProps) {
  const [items, setItems] = useState<ItemType[]>([]);
  const [showCreateItem, setShowCreateItem] = useState(false);

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

  return (
    <section>
      <h1>Items</h1>
      <article>
        <button onClick={() => setShowCreateItem(!showCreateItem)} className={styles.addItem}>
          +
        </button>
        {showCreateItem && (
          <CreateItem
            onItemCreated={fetchItems}
            backButton={() => setShowCreateItem(false)}
          />
        )}
        <div className={styles.itemsContainer}>
          {items.map((item) => {
            const sprintDoItem = sprints.find((sprint) =>
              sprint.items.some((i) => i.itemId === item.itemId),
            );
            return (
              <div key={item.itemId} className={styles.itemContainer}>
                <div>
                  <p>{item.title}</p>
                  <p>{item.priority}</p>
                  <ul>
                    {item.positions.map((position, index) => (
                      <li key={index}>{position.positionName}</li>
                    ))}
                  </ul>
                </div>
                <select
                  value={sprintDoItem?.sprintId || ""}
                  onChange={(e) =>
                    assignItemToSprint(item.itemId, e.target.value)
                  }
                >
                  <option value="">Sem sprint</option>
                  {sprints.map((sprint) => (
                    <option key={sprint.sprintId} value={sprint.sprintId}>
                      {sprint.title}
                    </option>
                  ))}
                </select>
                <button className={styles.deleteBtn} onClick={(e) => deleteItem(e, item.itemId)}>x</button>
              </div>
            );
          })}
        </div>
      </article>
    </section>
  );
}
