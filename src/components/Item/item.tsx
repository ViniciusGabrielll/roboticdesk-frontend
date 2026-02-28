type ItemProps = {
  item: {
    id: number;
    title: string;
    priority: number;
    positions: { positionName: string }[];
  };
};

export default function Item({ item }: ItemProps) {
  return (
    <div>
      <p>{item.title}</p>
      <p>{item.priority}</p>
      <ul>
        {item.positions.map((position, index) => (
          <li key={index}>{position.positionName}</li>
        ))}
      </ul>
    </div>
  );
}
