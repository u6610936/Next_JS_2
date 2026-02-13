import { useUser } from "../contexts/UserProvider";
import { useEffect, useState, useRef } from "react";

export default function UserManagement() {
  const { logout } = useUser();
  const API_URL = import.meta.env.VITE_API_URL;

  const [data, setData] = useState(null);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const fileRef = useRef();

  async function fetchProfile() {
    const res = await fetch(`${API_URL}/api/user/profile`, {
      credentials: "include",
    });

    if (res.status === 401) {
      logout();
      return;
    }

    const json = await res.json();

    setData(json);
    setFirstname(json.firstname || "");
    setLastname(json.lastname || "");
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  async function updateProfile() {
    const res = await fetch(`${API_URL}/api/user/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        firstname,
        lastname,
      }),
    });

    if (res.ok) {
      alert("Profile updated!");
      fetchProfile();
    }
  }

  async function uploadImage() {
    const file = fileRef.current.files[0];
    if (!file) return alert("Select an image");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/api/user/profile/image`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (res.ok) {
      alert("Image uploaded!");
      fetchProfile();
    }
  }

  if (!data) return <h2 style={{ padding: 40 }}>Loading...</h2>;

  return (
    <div style={container}>
      <div style={card}>
        <h1>User Profile</h1>

        {/* PROFILE IMAGE */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img
            src={
              data.profileImage
                ? `${API_URL}${data.profileImage}`
                : "https://via.placeholder.com/140"
            }
            style={avatar}
          />

          <input type="file" ref={fileRef} />
          <button onClick={uploadImage} style={btn}>
            Upload Image
          </button>
        </div>

        {/* USER INFO */}
        <Info label="ID" value={data._id} />
        <Info label="Email" value={data.email} />

        <label>First Name</label>
        <input
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          style={input}
        />

        <label>Last Name</label>
        <input
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          style={input}
        />

        <button onClick={updateProfile} style={btn}>
          Update Profile
        </button>

        <button
          onClick={logout}
          style={{ ...btn, background: "#ef4444" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

/* ---------- UI ---------- */

function Info({ label, value }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <strong>{label}:</strong>
      <div style={{ color: "#94a3b8" }}>{value}</div>
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
  width: 450,
  padding: 35,
  borderRadius: 18,
  background: "#1e293b",
  color: "white",
  boxShadow: "0 0 50px rgba(0,0,0,0.7)",
};

const avatar = {
  width: 140,
  height: 140,
  borderRadius: "50%",
  objectFit: "cover",
  marginBottom: 10,
};

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 10,
  border: "none",
  background: "#0f172a",
  color: "white",
};

const btn = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: "none",
  background: "#3b82f6",
  color: "white",
  fontWeight: "bold",
  marginTop: 10,
  cursor: "pointer",
};
