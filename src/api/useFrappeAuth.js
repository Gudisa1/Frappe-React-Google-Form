import { useState, useEffect } from "react";
import { getLoggedUser, loginUser, logoutUser } from "./auth";
export const useFrappeAuth = () => {
  const [currentUser, setCurrentUser] = useState(null); // {username, email, roles}
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getLoggedUser();
      setCurrentUser(user);
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (usr, pwd) => {
    setError(null);
    try {
      const user = await loginUser(usr, pwd);
      setCurrentUser(user);
    } catch (err) {
      setError(err.message);
    }
  };

  const logout = async () => {
    await logoutUser();
    setCurrentUser(null);
  };

  return { currentUser, isLoading, error, login, logout };
};