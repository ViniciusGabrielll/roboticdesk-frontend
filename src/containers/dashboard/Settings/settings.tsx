import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const [teamId, setTeamId] = useState<string | null>(null);

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
    }

    fetchUser();
  }, []);

  async function leaveTeam() {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch("http://localhost:8080/teams/leave", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao sair do time");
      }

      navigate("/team/choose");
    } catch (error) {
      console.error("Erro ao sair do time", error);
    }
  }

  async function deleteTeam() {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`http://localhost:8080/teams/${teamId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar time");
      }

      navigate("/team/choose");
    } catch (error) {
      console.error("Erro ao deletar time", error);
    }
  }

  return (
    <div>
      <h1>Configurações</h1>
      <button onClick={leaveTeam}>Sair do Time</button>
      <button onClick={deleteTeam}>Deletar Time</button>
    </div>
  );
}
