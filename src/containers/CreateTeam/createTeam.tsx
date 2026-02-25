import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateTeam() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = {
      name
    };

    try {
      const response = await fetch("http://localhost:8080/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar time");
      }

      setName("");
      
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Erro ao criar time");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Criar time</h1>
      <label htmlFor="name">Nome do time</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button>Criar</button>
    </form>
  );
}
