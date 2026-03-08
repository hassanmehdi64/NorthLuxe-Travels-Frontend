import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const RequireRole = ({ roles = [], children, fallback = "/admin" }) => {
  const { user } = useAuth();
  const role = user?.role;

  if (!role || (roles.length && !roles.includes(role))) {
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default RequireRole;
