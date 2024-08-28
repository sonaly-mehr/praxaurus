'use client';
import React, { useEffect, useState } from 'react';
import { Button } from './button';
import Link from 'next/link';
import { getUser, logoutUser } from '../../app/action'; // Correct path to your action
import { toast } from 'sonner';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [userLogout, setUserLogout] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        // toast.error(error.message);
      }
    };
    // const logout = async()=> {
    //   const data = await logoutUser();
    //   setUserLogout(data)
    // }

    fetchUser();
  }, []);

  const logoutHandler = async()=> {
    await logoutUser();
    toast.success("Logged out!")
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center my-5">
        <div>
          <h4>LOGO</h4>
        </div>
        <div>
          {user ? (
            <Button asChild variant="destructive">
              <Link href="/login" onClick={logoutHandler}>Logout</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;