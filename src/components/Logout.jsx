import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserProvider";
import { Navigate } from "react-router-dom";

export default function Logout() {
  const [done, setDone] = useState(false);
  const { logout } = useUser();

  useEffect(() => {
    (async () => {
      await logout();
      setDone(true);
    })();
  }, []);

  if (!done) return <div style={{ padding: 20 }}>Logging out...</div>;
  return <Navigate to="/login" replace />;
}
