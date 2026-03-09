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
      priority: number;
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
      {user && <h1>Nome: {user.teamName}</h1>}
      <Sprints sprints={sprints} refreshSprint={refreshSprint} />
    </div>
  );
}
