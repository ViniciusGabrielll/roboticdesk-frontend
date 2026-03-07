import { use, useEffect, useState } from "react";
import Item from "../../../components/Item/item";
import CreateItem from "../../../components/CreateItem/createItem";

type ItemType = {
  itemId: number;
  title: string;
  priority: number;
  status: string;
  positions: { positionName: string }[];
};

type SprintType = {
  sprintId: number;
  title: string;
  fromTime: string;
  toTime: string;
  items: {
    itemId: number;
  }[];
};

export default function Items() {
  const [items, setItems] = useState<ItemType[]>([]);
  const [sprints, setSprints] = useState<SprintType[]>([]);
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

  async function fetchSprints() {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch("http://localhost:8080/sprints", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      const sorted = data.sort(
        (a: SprintType, b: SprintType) =>
          new Date(a.fromTime).getTime() - new Date(b.fromTime).getTime(),
      );

      setSprints(sorted);
    } catch (error) {
      console.error("Erro ao buscar sprints", error);
    }
  }

  useEffect(() => {
    fetchSprints();
  }, []);

  async function assignItemToSprint(itemId: number, sprintId: string) {
    const token = localStorage.getItem("accessToken");

    await fetch(`http://localhost:8080/sprints/${sprintId}/items/${itemId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchSprints();
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
            <Item item={item} />

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
