import styles from "./navbar.module.css";
import { Link } from "react-router-dom";
import logo from "../../../assets/images/logos/roboticDesk.svg";

type UserProps = {
  user: {
    username: string;
    email: string;
  };
};

export default function NavBarDashboard({ user }: UserProps) {
  return (
    <nav className={styles.container}>
      <div className={styles.links}>
        <Link to="/dashboard/home" className={styles.link}>
          Home
        </Link>
        <Link to="/dashboard/items" className={styles.link}>
          Tarefas
        </Link>
        <Link to="/dashboard/members" className={styles.link}>
          Membros
        </Link>
        <Link to="/dashboard/positions" className={styles.link}>
          Cargos
        </Link>
        <Link to="/dashboard/settings" className={styles.link}>
          Configurações
        </Link>
      </div>
      <div className={styles.userContainer}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <div>
          <p className={styles.userName}>{user?.username}</p>
          <p className={styles.userEmail}>{user?.email}</p>
        </div>
      </div>
    </nav>
  );
}
