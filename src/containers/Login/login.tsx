import styles from "./login.module.css";

export default function Login() {
  return (
    <div className={styles.loginContainer}>
      <form className={styles.formContainer}>
        <h1>Cadastre-se</h1>

        <div className={styles.formGroup}>
          <label htmlFor="username">Nome de Usuário</label>
          <input id="username" type="text"></input>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email"></input>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Senha</label>
          <input id="password" type="password"></input>
        </div>

        <button type="submit" className="form-button">
          Cadastrar-se
        </button>
      </form>
    </div>
  );
}
