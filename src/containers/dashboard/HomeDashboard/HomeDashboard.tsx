import Sprints from "../Sprints/sprints";

type DashboardProps = {
  sprints: {
    sprintId: number;
    title: string;
    fromTime: string;
    toTime: string;
    items: {
      itemId: number;
      title: string;
      priority: string;
      status: string;
      positions: { positionName: string }[];
    }[];
  }[];
  refreshSprint: () => void;
  user: {
    teamName: string;
  };
};

export default function HomeDashboard({
  sprints,
  refreshSprint,
  user,
}: DashboardProps) {
  return (
    <div>
      <section>
        <article>{user && <h1>{user.teamName}</h1>}</article>
      </section>
      <Sprints sprints={sprints} refreshSprint={refreshSprint} />
    </div>
  );
}
