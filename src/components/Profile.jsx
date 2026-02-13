import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserProvider";

export default function Profile() {
  const { logout } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const API_URL = import.meta.env.VITE_API_URL;

  async function fetchProfile() {
    const result = await fetch(`${API_URL}/api/user/profile`, {
      credentials: "include",
    });

    if (result.status === 401) {
      await logout();
      return;
    }

    const json = await result.json();
    setData(json);
    setIsLoading(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchProfile();
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Profile</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div>ID: {data._id}</div>
          <div>Email: {data.email}</div>
          <div>First Name: {data.firstname}</div>
          <div>Last Name: {data.lastname}</div>
        </div>
      )}
    </div>
  );
}
