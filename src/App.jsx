import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./middleware/RequireAuth";

import Login from "./components/Login";
import Logout from "./components/Logout";
import UserManagement from "./components/UserManagement";

export default function App() {
  return (
    <Routes>
      
      {/* Default route */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <UserManagement />
          </RequireAuth>
        }
      />

      <Route
        path="/logout"
        element={
          <RequireAuth>
            <Logout />
          </RequireAuth>
        }
      />

      {/* Catch all (กัน user พิมพ์ path มั่ว) */}
      <Route path="*" element={<Navigate to="/login" replace />} />
      
    </Routes>
  );
}
