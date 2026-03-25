import { useEffect, useState } from "react";
import styles from "./changePosition.module.css";

type MemberProps = {
  fetchMembers: () => void;
  member: {
    userId: string;
    username: string;
    positions: { positionId: number; positionName: string; color: string }[];
  };
  teamId: number;
  closeTab: () => void;
};

type PositionType = {
  positionId: number;
  color: string;
  positionName: string;
};

export default function ChangePosition({
  fetchMembers,
  member,
  closeTab,
  teamId,
}: MemberProps) {
  const [positions, setPositions] = useState<PositionType[]>([]);

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

  async function AtributeUserPosition(memberId: string, positionId: number) {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `http://localhost:8080/positions/teams/${teamId}/users/${memberId}/${positionId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao atribuir position á usuario");
      }

      fetchMembers();
    } catch (error) {
      console.error("Erro ao atribuir position á usuario", error);
    }
  }

  async function RemoveUserPosition(memberId: string, positionId: number) {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `http://localhost:8080/positions/users/${memberId}/${positionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao remover position de usuario");
      }

      fetchMembers();
    } catch (error) {
      console.error("Erro ao atribuir position á usuario", error);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.tab}>
        <h2>{member.username}</h2>
        <div className={styles.changeStatusContainers}>
          <div className={styles.changeStatusContainer}>
            <h3>
              <span style={{ color: "var(--secondary-color)" }}>Adcionar</span>{" "}
              Cargo
            </h3>
            <div className={styles.positionsContainer}>
              {positions
                .filter(
                  (position) =>
                    !member.positions.some(
                      (memberPosition) =>
                        memberPosition.positionName === position.positionName,
                    ),
                )
                .map((position) => (
                  <button
                    key={position.positionId}
                    className={styles.positionContainer}
                    onClick={() => {
                      AtributeUserPosition(member.userId, position.positionId);
                    }}
                  >
                    <div style={{ backgroundColor: position.color }} />
                    <p>{position.positionName}</p>
                  </button>
                ))}
            </div>
          </div>
          <div className={styles.changeStatusContainer}>
            <h3>
              <span style={{ color: "red" }}>Remover</span> Cargo
            </h3>
            <div className={styles.positionsContainer}>
              {member.positions.map((position) => (
                <button
                  key={position.positionId}
                  className={styles.positionContainer}
                  onClick={() => {
                    RemoveUserPosition(member.userId, position.positionId);
                  }}
                >
                  <div style={{ backgroundColor: position.color }} />
                  <p>{position.positionName}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
        <button className={styles.backBtn} onClick={closeTab}>
          x
        </button>
      </div>
    </div>
  );
}
