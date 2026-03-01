import { useEffect, useState } from "react";
import Items from "./Items/items";
import Settings from "./Settings/settings";
import Members from "./Members/members";
import MainDashboard from "./Main/mainDashboard";
import Sprints from "./Sprints/sprints";

export default function Dashboard() {
  return (
    <>
      <MainDashboard />
      <Sprints />
      <Items />
      <Members />
      <Settings />
    </>
  );
}
