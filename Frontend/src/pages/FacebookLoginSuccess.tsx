import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext";

export default function FacebookLoginSuccess() {
  const { setUser } = useContext(AuthContext)!;
  const navigate = useNavigate();

  useEffect(() => {
    // ลบ #_=_ ออกจาก URL
    if (window.location.hash === "#_=_") {
      window.history.replaceState(null, "", window.location.pathname);
    }

    axios
      .get("http://localhost:3000/auth/profile", { withCredentials: true })
      .then(res => {
        setUser(res.data);
        navigate("/function");
      })
      .catch(() => navigate("/login"));
  }, []);

  return <div>Logging in with Facebook...</div>;
}
