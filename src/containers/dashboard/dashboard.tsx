import { useEffect, useState } from "react";
import MainDashboard from "./Items/items";
import Settings from "./Settings/settings";
import Members from "./Members/members";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:8080/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem("accessToken");
          return;
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    }

    fetchUser();
  }, []);

  return (
    <>
      {user && (
        <>
          <p>Nome: {user.teamName}</p>
        </>
      )}
      <MainDashboard/>
      <Members/>
      <Settings/>
    </>
  );
}
