import { Link } from "react-router-dom";

export default function NavBarDashboard() {
  return (
    <div>
      <Link to="/dashboard/home">Home</Link>
      <Link to="/dashboard/items">Items</Link>
      <Link to="/dashboard/members">Membros</Link>
    </div>
  );
}
