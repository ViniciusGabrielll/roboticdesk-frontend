import { useEffect, useState } from "react";

export default function Members() {
  const [teamId, setTeamId] = useState<string | null>(null);
  const [invite, setInvite] = useState<string | null>(null);

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

  async function createInvite() {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `http://localhost:8080/teams/${teamId}/invites`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao criar invite");
      }
      const data = await response.text();
      setInvite(data);
    } catch (error) {
      console.error("Erro ao criar invite", error);
    }
  }
  return (
    <div>
      <h1>Members</h1>
      <button onClick={createInvite}>Gerar convite</button>
      {invite && <p>{invite}</p>}
    </div>
  );
}
