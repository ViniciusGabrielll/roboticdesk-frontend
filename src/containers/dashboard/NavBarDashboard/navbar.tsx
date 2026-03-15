import styles from "./navbar.module.css"
import { Link } from "react-router-dom";

export default function NavBarDashboard() {
  return (
    <nav className={styles.container}>
      <Link to="/dashboard/home" className={styles.link}>Home</Link>
      <Link to="/dashboard/items" className={styles.link}>Items</Link>
      <Link to="/dashboard/members" className={styles.link}>Membros</Link>
      <Link to="/dashboard/settings" className={styles.link}>Configurações</Link>
    </nav>
  );
}
