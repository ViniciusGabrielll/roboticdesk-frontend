import { useEffect, useState } from "react";
import styles from "./positions.module.css";
import BackgroundEffect from "../../../components/BackgroundEffect/backgroundEffect";

type PositionType = {
  positionId: number;
  color: string;
  positionName: string;
};

type UserType = {
  id: string;
  roles: { name: string }[];
};

export default function Positions() {
  const [teamId, setTeamId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [positions, setPositions] = useState<PositionType[]>([]);
  const [showCreatePosition, setShowCreatePosition] = useState(false);
  const [color, setColor] = useState("#000000");
  const [positionName, setPositionName] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("accessToken");

      const response = await fetch("http://localhost:8080/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return;

      const data = await response.json();
      setTeamId(data.teamId);
      setCurrentUser(data);
    }

    fetchUser();
  }, []);

  async function fetchPositions() {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `http://localhost:8080/positions/teams/${teamId}`,
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
  useEffect(() => {
    if (!teamId) return;
    fetchPositions();
  }, [teamId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = {
      positionName,
      color,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/positions/teams/${teamId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao Adcionar Sprint");
      }

      await fetchPositions();
      setPositionName("");
      setColor("#000000");
    } catch (error) {
      console.error(error);
      alert("Erro ao adcionar");
    }
  }

  async function deletePosition(e: React.MouseEvent, positionId: number) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `http://localhost:8080/positions/${positionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao deletar position");
      }

      fetchPositions();
    } catch (error) {
      console.error("Erro ao deletar position", error);
    }
  }

  useEffect(() => {
    if (!teamId) return;
    fetchPositions();
  }, [teamId]);

  return (
    <section>
      <h1>Cargos</h1>
      <div className={styles.backgroundContainer}>
        <BackgroundEffect className={styles.background} />
      </div>
      <article className={styles.positionsContainer}>
        {currentUser &&
          teamId &&
          positions.map((position) => (
            <div key={position.positionId} className={styles.positionContainer}>
              <div style={{ backgroundColor: position.color }} />
              <p>{position.positionName}</p>

              <button
                onClick={(e) => deletePosition(e, position.positionId)}
                className={styles.deleteBtn}
              >
                x
              </button>
            </div>
          ))}
        <button
          className={styles.addPosition}
          onClick={() => {
            setShowCreatePosition(!showCreatePosition);
          }}
        >
          +
        </button>
        {showCreatePosition && (
          <div className={styles.createPositionContainer}>
            <div className={styles.squareCreatePosition}>
              <h2>Criar Cargo</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />

                <input
                  type="text"
                  value={positionName}
                  onChange={(e) => setPositionName(e.target.value)}
                />

                <button>Criar</button>
              </form>
              <button
                className={styles.backBtn}
                onClick={() => {
                  setShowCreatePosition(!showCreatePosition);
                }}
              >
                x
              </button>
            </div>
          </div>
        )}
      </article>
    </section>
  );
}
