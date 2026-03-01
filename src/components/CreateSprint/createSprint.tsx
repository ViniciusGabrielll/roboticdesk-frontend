import { useState } from "react";

type Props = {
  onSprintCreated: () => void;
};

export default function CreateSprint({ onSprintCreated }: Props) {
  const [title, setTitle] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = {
      title,
      fromTime,
      toTime,
    };

    try {
      const response = await fetch("http://localhost:8080/sprints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao Adcionar Sprint");
      }

      setFromTime("");
      setToTime("");

      onSprintCreated();
    } catch (error) {
      console.error(error);
      alert("Erro ao adcionar");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Criar Sprint</h2>
      <label htmlFor="fromTime">Objetivo da Sprint: </label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <label htmlFor="fromTime">Data de início: </label>
      <input
        type="date"
        id="fromTime"
        value={fromTime}
        onChange={(e) => setFromTime(e.target.value)}
        required
      />
      <label htmlFor="fromTime">Data de finalização: </label>
      <input
        type="date"
        id="toTime"
        value={toTime}
        onChange={(e) => setToTime(e.target.value)}
        required
      />
      <button>Adicionar</button>
    </form>
  );
}
