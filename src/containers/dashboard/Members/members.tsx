import { useEffect, useState } from "react";
import Member from "../../../components/Member/member";

type MemberType = {
  userId: string;
  username: string;
  positions: { positionName: string }[];
  roles: { name: string }[];
};

type UserType = {
  id: string;
  roles: { name: string }[];
};

export default function Members() {
  const [teamId, setTeamId] = useState<number | null>(null);
  const [invite, setInvite] = useState<string | null>(null);
  const [members, setMembers] = useState<MemberType[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

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
      {currentUser && teamId &&
        members.map((member) => (
          <Member key={member.userId} fetchMembers={fetchMembers} member={member} user={currentUser} teamId={teamId}/>
        ))}
    </div>
  );
}
