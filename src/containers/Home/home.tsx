import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <h1>Home</h1>
      <Link to="/register">Cadastrar-se</Link>
      <Link to="/login">Login</Link>
    </>
  );
}
