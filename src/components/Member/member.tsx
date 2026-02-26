type MemberProps = {
  member: {
    id: number;
    username: string;
  };
};

export default function Member({ member }: MemberProps) {
  return (
    <div>
      <p>{member.username}</p>
    </div>
  );
}
