import styles from "./member.module.css";

type MemberProps = {
  fetchMembers: () => void;
  member: {
    userId: string;
    username: string;
    positions: { positionName: string; color: string }[];
  };
  user: { roles: { name: string }[]; id: string };
  teamId: number;
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
    <div className={styles.container}>
      <ul>
        {member.positions.map((position, index) => (
          <li key={index}>
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
      {isScrumMasterOrAdmin && member.userId !== user.id && (
        <button onClick={() => kickOutMember(member.userId)}>Expulsar</button>
      )}
    </div>
  );
}
