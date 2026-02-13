import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserProvider.jsx";

export default function RequireAuth({ children }) {
  const { user } = useUser();
  if (!user?.isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}
