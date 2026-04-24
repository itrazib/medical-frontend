import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useauth";
// import useAuth from "../../Hooks/UseAuth";

const GoogleRedirect = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const backendURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // Get the logged-in user from backend session
    axios
      .get(`${backendURL}/api/whoami`, { withCredentials: true })
      .then((res) => {
        setUser(res.data);

        navigate("/"); // fallback
      })
      .catch((err) => {
        console.error("Error fetching user from session:", err);
        navigate("/login"); // if something goes wrong
      });
  }, [setUser, navigate]);

  return <div className="text-center mt-20">Logging you in via Google...</div>;
};

export default GoogleRedirect;
