import { useNavigate } from "react-router-dom";

export default function Settings() {
    const navigate = useNavigate();
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

  return (
    <div>
      <h1>Settings</h1>
      <button onClick={leaveTeam}>Leave Team</button>
    </div>
  );
}
