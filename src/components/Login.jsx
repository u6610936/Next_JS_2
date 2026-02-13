import { useRef, useState } from "react";
import { useUser } from "../contexts/UserProvider";
import { Navigate } from "react-router-dom";

export default function Login() {
  const emailRef = useRef();
  const passRef = useRef();

  const { user, login } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onLogin() {
    setLoading(true);
    setError("");

    const email = emailRef.current.value;
    const password = passRef.current.value;

    const result = await login(email, password);

    if (!result) {
      setError("Invalid email or password");
      setLoading(false);
    }
  }

  if (user.isLoggedIn) return <Navigate to="/profile" replace />;

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={{ marginBottom: 10 }}>Welcome Back 👋</h1>
        <p style={{ marginBottom: 25, color: "#94a3b8" }}>
          Login to continue
        </p>

        <input
          ref={emailRef}
          placeholder="Email"
          style={input}
        />

        <input
          ref={passRef}
          type="password"
          placeholder="Password"
          style={input}
        />

        {error && (
          <div style={{ color: "#ef4444", marginBottom: 10 }}>
            {error}
          </div>
        )}

        <button
          onClick={onLogin}
          style={button}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

const container = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0f172a, #020617)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const card = {
  width: 380,
  padding: 40,
  borderRadius: 18,
  background: "#1e293b",
  boxShadow: "0 0 60px rgba(0,0,0,0.6)",
  color: "white",
  textAlign: "center",
};

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 15,
  borderRadius: 10,
  border: "none",
  background: "#0f172a",
  color: "white",
  fontSize: 16,
};

const button = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "none",
  background: "#3b82f6",
  color: "white",
  fontWeight: "bold",
  fontSize: 16,
  cursor: "pointer",
};
