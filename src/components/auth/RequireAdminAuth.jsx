import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const RequireAdminAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-10 text-center text-slate-500">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return children;
};

export default RequireAdminAuth;
