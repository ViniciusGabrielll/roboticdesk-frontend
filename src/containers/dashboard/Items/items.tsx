import { use, useEffect, useState } from "react";
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

  return (
    <>
      <h1>Items</h1>
      <button onClick={() => setShowCreateItem(!showCreateItem)}>
        Add item
      </button>
      {showCreateItem && <CreateItem onItemCreated={fetchItems} />}
      {items.map((item) => {
        const sprintDoItem = sprints.find((sprint) =>
          sprint.items.some((i) => i.itemId === item.itemId),
        );
        return (
          <div key={item.itemId}>
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
              onChange={(e) => assignItemToSprint(item.itemId, e.target.value)}
            >
              <option value="">Sem sprint</option>
              {sprints.map((sprint) => (
                <option key={sprint.sprintId} value={sprint.sprintId}>
                  {sprint.title}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </>
  );
}
