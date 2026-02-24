import { useState } from "react";

type Props = {
  onItemCreated: () => void;
};

export default function CreateItem({ onItemCreated }: Props) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<number>(0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = {
      title,
      priority,
    };

    try {
      const response = await fetch("http://localhost:8080/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao Adcionar item");
      }

      setTitle("");
      setPriority(0);

      onItemCreated();
    } catch (error) {
      console.error(error);
      alert("Erro ao adcionar");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Item</h2>
      <label htmlFor="title">Título</label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <label htmlFor="priority">Prioridade</label>
      <input
        type="number"
        id="priority"
        value={priority}
        onChange={(e) => setPriority(Number(e.target.value))}
        required
      />
      <button>Adicionar</button>
    </form>
  );
}
