import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const RoleRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;

  if (user.usertype === "Admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/explorepackages" replace />;
};
export default RoleRedirect;