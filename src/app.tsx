import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./containers/Home/home";
import Register from "./containers/userRequest/Register/register";
import Login from "./containers/userRequest/Login/login";
import Dashboard from "./containers/dashboard/dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import ChooseTeam from "./containers/ChooseTeam/chooseTeam";
import CreateTeam from "./containers/CreateTeam/createTeam";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/team/choose" element={<ChooseTeam />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="team/create"
          element={
            <PrivateRoute>
              <CreateTeam />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
