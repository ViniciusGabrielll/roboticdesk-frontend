import styles from "./homeDashboard.module.css";
import Sprints from "../Sprints/sprints";
import BackgroundEffect from "../../../components/BackgroundEffect/backgroundEffect";

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
    <div className={styles.container}>
      <div className={styles.backgroundContainer}>
        <BackgroundEffect className={styles.background} />
      </div>
      <section className={styles.teamContainer}>
        {user && <h1 className={styles.teamTitle}>{user.teamName}</h1>}
        <article></article>
      </section>
      <Sprints sprints={sprints} refreshSprint={refreshSprint} />
    </div>
  );
}
