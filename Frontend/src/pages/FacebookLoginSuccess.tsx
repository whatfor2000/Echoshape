// src/pages/FacebookLoginSuccess.tsx
import React, { useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function FacebookLoginSuccess() {
  const [searchParams] = useSearchParams();
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("access_token", token);

      // fetch user profile from backend
      fetch("http://localhost:3000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          setUser(data);
          navigate("/dashboard");
        })
        .catch(() => navigate("/login"));
    } else {
      navigate("/login");
    }
  }, [token, setUser, navigate]);

  return <div>Logging in with Facebook...</div>;
}
