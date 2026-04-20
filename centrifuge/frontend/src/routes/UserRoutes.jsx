import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const UserRoutes = () => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />; 
  if (userRole !== 'EVENTMANAGER') return <Navigate to="/unauthorized" replace />;


  return (
    <>
      <div className="h-screen relative">
        <div className="absolute inset-0">
          <Outlet />
        </div>
      </div>
    </>


  );
};

export default UserRoutes;
