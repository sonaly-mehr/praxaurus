'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUser, logoutUser } from '../app/services/auth/action'; // Correct path to your action
import { toast } from 'sonner';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        // toast.error(error.message);
      }
    };

    fetchUser();
  }, []);

  const logoutHandler = async () => {
    await logoutUser();
    setUser(null); // Clear user data on logout
    toast.success("Logged out!");
  };

  return (
    <UserContext.Provider value={{ user, logoutHandler }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);