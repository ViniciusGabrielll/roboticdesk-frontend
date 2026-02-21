import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./containers/Home/home";
import Register from "./containers/userRequest/Register/register";
import Login from "./containers/userRequest/Login/login";
import Dashboard from "./containers/dashboard/dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import ChooseTeam from "./containers/ChooseTeam/chooseTeam";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/choose-team" element={<ChooseTeam />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
