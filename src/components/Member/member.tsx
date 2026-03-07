type MemberProps = {
  fetchMembers: () => {};
  member: {
    userId: string;
    username: string;
    positions: { positionName: string }[];
  };
  user: { roles: { name: string }[]; id: string };
  teamId: number;
};

export default function Member({ fetchMembers, member, user, teamId }: MemberProps) {
  const isScrumMasterOrAdmin = user.roles?.some(
    (role) => role.name === "scrummaster" || role.name === "admin",
  );

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

  return (
    <div>
      <p>{member.username}</p>
      <ul>
        {member.positions.map((position, index) => (
          <li key={index}>{position.positionName}</li>
        ))}
      </ul>
      {isScrumMasterOrAdmin && member.userId !== user.id && (
        <button onClick={() => kickOutMember(member.userId)}>Kick Out</button>
      )}
    </div>
  );
}
