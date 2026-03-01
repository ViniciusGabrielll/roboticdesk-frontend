type SprintProps = {
  sprint: {
    id: number;
    title: string;
    fromTime: string;
    toTime: string;
  };
  order: number;
};

export default function Sprint({ sprint, order }: SprintProps) {
  return (
    <div>
      <p>{sprint.title}</p>
      <p>De: {sprint.fromTime}</p>
      <p>Para: {sprint.toTime}</p>
    </div>
  );
}
