import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Navbar from "../components/Navbar/Navbar";

const AdminRoutes = () => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (userRole !== "ADMIN") return <Navigate to="/unauthorized" replace />;

  return (
    <>
      <div className="h-screen relative">
        <div className="absolute inset-0">
          <Navbar />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminRoutes;
