import { useEffect, useState } from "react";
import Item from "../../../components/Item/item";
import CreateItem from "../../../components/CreateItem/createItem";

type ItemType = {
  id: number;
  title: string;
  priority: number;
};

export default function MainDashboard() {
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

  return (
    <>
      <h1>Items</h1>
      <button onClick={() => setShowCreateItem(!showCreateItem)}>
        Add item
      </button>
      {showCreateItem && <CreateItem onItemCreated={fetchItems} />}
      {items.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </>
  );
}
