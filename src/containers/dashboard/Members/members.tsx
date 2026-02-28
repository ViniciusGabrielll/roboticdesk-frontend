import { useEffect, useState } from "react";
import Member from "../../../components/Member/member";

type MemberType = {
  id: number;
  username: string;
  positions: { positionName: string }[];
};

export default function Members() {
  const [teamId, setTeamId] = useState<string | null>(null);
  const [invite, setInvite] = useState<string | null>(null);
  const [members, setMembers] = useState<MemberType[]>([]);

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

  async function fetchMembers() {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `http://localhost:8080/teams/${teamId}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error("Erro ao buscar items", error);
    }
  }

  useEffect(() => {
    if (!teamId) return;
    fetchMembers();
  }, [teamId]);

  return (
    <div>
      <h1>Membros</h1>
      <button onClick={createInvite} disabled={!teamId}>
        Gerar convite
      </button>
      {invite && <p>{invite}</p>}
      {members.map((member) => (
        <Member key={member.id} member={member} />
      ))}
    </div>
  );
}
