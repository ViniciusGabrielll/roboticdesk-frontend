type ItemProps = {
  item: {
    id: number;
    title: string;
    priority: number;
  };
};

export default function Item({ item }: ItemProps) {
  return (
    <div>
      <p>{item.title}</p>
      <p>{item.priority}</p>
    </div>
  );
}
