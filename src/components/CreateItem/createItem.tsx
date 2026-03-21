import { useEffect, useState } from "react";
import styles from "./createItem.module.css";

type Props = {
  onItemCreated: () => void;
  backButton: () => void;
};

type PositionType = {
  positionId: number;
  color: string;
  positionName: string;
  teamId: number;
};

type UserType = {
  id: string;
  teamId: number;
};

export default function CreateItem({ onItemCreated, backButton }: Props) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");
  const [positions, setPositions] = useState<PositionType[]>([]);
  const [positionsId, setPositionsId] = useState<number[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<number[]>([]);

  const [user, setUser] = useState<UserType>();

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:8080/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem("accessToken");
          return;
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    }

    fetchUser();
  }, []);

  async function fetchPositions() {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `http://localhost:8080/positions/teams/${user?.teamId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      setPositions(data);
    } catch (error) {
      console.error("Erro ao buscar cargos", error);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = {
      title,
      priority,
      positionsId: selectedPositions,
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
      setPriority("");

      onItemCreated();
    } catch (error) {
      console.error(error);
      alert("Erro ao adcionar");
    }
  }

  function togglePosition(positionId: number) {
    setSelectedPositions((prev) =>
      prev.includes(positionId)
        ? prev.filter((id) => id !== positionId)
        : [...prev, positionId],
    );
  }

  useEffect(() => {
    if (!user?.teamId) return;
    fetchPositions();
  }, [user]);

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
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
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          required
        >
          <option value="">Selecione</option>
          <option value="CRITICAL">Crítico</option>
          <option value="IMPORTANT">Importante</option>
          <option value="OPTIONAL">Opicional</option>
        </select>

        <div>
          {positions.map((position) => (
            <button
              key={position.positionId}
              onClick={() => togglePosition(position.positionId)}
              style={{
                opacity: selectedPositions.includes(position.positionId)
                  ? 1
                  : 0.5,
              }}
              type="button"
            >
              <div style={{ backgroundColor: position.color }} />
              <p>{position.positionName}</p>
            </button>
          ))}
        </div>
        <button type="submit">Adicionar</button>
        <button className={styles.backBtn} onClick={backButton}>
          x
        </button>
      </form>
    </div>
  );
}
