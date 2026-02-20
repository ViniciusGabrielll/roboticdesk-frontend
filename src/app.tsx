import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./containers/Home/home";
import Register from "./containers/userRequest/Register/register";
import Login from "./containers/userRequest/Login/login";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}