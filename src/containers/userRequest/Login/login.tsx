import { useState } from "react";
import styles from "./login.module.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function checkUser() {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const response = await fetch("http://localhost:8080/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = await response.json();

    if (user.teamId) {
      navigate("/dashboard");
    } else {
      navigate("/team/choose");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = {
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao Logar");
      }

      const result = await response.json();
      localStorage.setItem("accessToken", result.accessToken);
      checkUser();
    } catch (error) {
      console.error(error);
      alert("Erro no cadastro");
    }
  }

  return (
    <div className={styles.loginContainer}>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <h1>Login</h1>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>

        <button type="submit" className="form-button">
          Entrar
        </button>
      </form>
    </div>
  );
}
