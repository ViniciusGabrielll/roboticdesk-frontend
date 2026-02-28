type MemberProps = {
  member: {
    id: number;
    username: string;
    positions: { positionName: string }[];
  };
};

export default function Member({ member }: MemberProps) {
  return (
    <div>
      <p>{member.username}</p>
      <ul>
        {member.positions.map((position, index) => (
          <li key={index}>{position.positionName}</li>
        ))}
      </ul>
    </div>
  );
}
