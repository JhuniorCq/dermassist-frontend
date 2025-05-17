import { Navigate, Route, Routes } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
// import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import { useSelector } from "react-redux";
import { type RootState } from "../store/store";
import Diagnostic from "../pages/Diagnostic";

const AppRoutes = () => {
  const user = useSelector((state: RootState) => state.user);

  console.log("Usuario - AppRoutes: ", user);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute isAllowed={!!user.uid} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/diagnostic" element={<Diagnostic />} />
      </Route>
      <Route path="/*" element={<div>Error 404</div>} />
    </Routes>
  );
};

export default AppRoutes;
