import { useEffect, useState } from "react";
import styles from "./member.module.css";
import ChangePosition from "../ChangePosition/changePosition";

type MemberProps = {
  fetchMembers: () => void;
  member: {
    userId: string;
    username: string;
    positions: { positionId: number; positionName: string; color: string }[];
  };
  user: { roles: { name: string }[]; id: string };
  teamId: number;
};

type PositionType = {
  positionId: number;
  color: string;
  positionName: string;
};

export default function Member({
  fetchMembers,
  member,
  user,
  teamId,
}: MemberProps) {
  const isScrumMasterOrAdmin = user.roles?.some(
    (role) => role.name === "scrummaster" || role.name === "admin",
  );
  const [showChangePosition, setShowChangePosition] = useState(false);
  const [positions, setPositions] = useState<PositionType[]>([]);

  async function kickOutMember(memberId: string) {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `http://localhost:8080/teams/${teamId}/users/${memberId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao expulsar usuario");
      }

      fetchMembers();
    } catch (error) {
      console.error("Erro ao expulsar usuario", error);
    }
  }

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

  useEffect(() => {
    if (!teamId) return;
    fetchPositions();
  }, [teamId]);

  return (
    <>
      <div className={styles.container}>
        <ul>
          {member.positions.map((position, index) => (
            <li key={index} className={styles.positionMemberContainer}>
              <div
                className={styles.positionColor}
                style={{ backgroundColor: position.color }}
              ></div>
              <p>{position.positionName}</p>
            </li>
          ))}
        </ul>
        <p>|</p>
        <p>{member.username}</p>
        <div className={styles.scrumPermissions}>
          {isScrumMasterOrAdmin && (
            <div>
              <button
                onClick={() => {
                  setShowChangePosition(!showChangePosition);
                }}
                className={styles.scrumButton}
                style={{ backgroundColor: "var(--secondary-color)" }}
              >
                Mudar Cargo
              </button>
            </div>
          )}
          {isScrumMasterOrAdmin && member.userId !== user.id && (
            <button
              onClick={() => kickOutMember(member.userId)}
              className={styles.scrumButton}
              style={{ backgroundColor: "rgb(255, 111, 111)" }}
            >
              Expulsar
            </button>
          )}
        </div>
      </div>

      {showChangePosition && (
        <ChangePosition
          fetchMembers={fetchMembers}
          member={member}
          closeTab={() => setShowChangePosition(false)}
          teamId={teamId}
        />
      )}
    </>
  );
}
