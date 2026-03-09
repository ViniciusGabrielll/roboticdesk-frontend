import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import Items from "./Items/items";
import Settings from "./Settings/settings";
import Members from "./Members/members";
import Sprints from "./Sprints/sprints";
import { Link, Route, Routes } from "react-router-dom";
import HomeDashboard from "./HomeDashboard/HomeDashboard";
import NavBarDashboard from "./NavBarDashboard/navbar";

type SprintType = {
  sprintId: number;
  title: string;
  fromTime: string;
  toTime: string;
  items: {
    itemId: number;
    title: string;
    priority: number;
    status: string;
    positions: { positionName: string }[];
  }[];
};

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

  const [sprints, setSprints] = useState<SprintType[]>([]);

  async function fetchSprints() {
    const token = localStorage.getItem("accessToken");

    const response = await fetch("http://localhost:8080/sprints", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    const sorted = data.sort(
      (a: SprintType, b: SprintType) =>
        new Date(a.fromTime).getTime() - new Date(b.fromTime).getTime(),
    );
    setSprints(sorted);
  }

  useEffect(() => {
    fetchSprints();
  }, []);

  return (
    <>
      <NavBarDashboard />
      <Routes>
        <Route
          path="home"
          element={
            <HomeDashboard
              sprints={sprints}
              refreshSprint={fetchSprints}
              user={user}
            />
          }
        />
        <Route
          path="items"
          element={<Items sprints={sprints} refreshSprint={fetchSprints} />}
        />

        <Route path="members" element={<Members />} />

        <Route path="settings" element={<Settings />} />
      </Routes>
    </>
  );
}
