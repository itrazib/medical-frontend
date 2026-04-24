import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import api from '../utils/api';
import axios from 'axios';

const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const backendURL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    if (!user) {
      axios
        .get(`${backendURL}/api/whoami`, { withCredentials: true })
        .then(({ data }) => {
          console.log(data);
          setUser(data);
          setReady(true);
        })
        .catch((err) => {
          console.error("whoami error:", err);
          setReady(true);
        }); // Even on error, mark ready
    }
  }, []);

    const authInfo = {
      user,
      setUser,
      ready
    }
    return (
        <AuthContext value={authInfo}>{children}</AuthContext>
    );
};

export default AuthProvider;