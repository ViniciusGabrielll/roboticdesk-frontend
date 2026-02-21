import { useState } from "react";
import { Link } from "react-router-dom";

export default function ChooseTeam() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  async function handleJoin() {
    setError("");

    const res = await fetch(`http://localhost:8080/teams/invites/${token}/accept`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!res.ok) {
      const msg = await res.text();
      setError(msg || "Erro ao entrar no time");
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <div>
      <Link to="/team/create">Criar time</Link>
      <h1>Entrar em um time</h1>
      <input
        type="text"
        placeholder="Cole o código de convite"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <button onClick={handleJoin}>Entrar</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
