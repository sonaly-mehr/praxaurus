"use client";
import React from "react";
import { Button, buttonVariants } from "./button";
import Link from "next/link";
import { useUser } from "../../contextApi/UserContext";
import { Sparkles } from "lucide-react";

const Navbar = () => {
  const { user, logoutHandler } = useUser();
  console.log("user info:", user);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center my-5">
        <div>
          <Link href="/">LOGO</Link>
        </div>
        <div>
          <ul className="flex gap-5 capitalize items-center">
            <li>
              <Link href="/news">News</Link>
            </li>
            {user && (
              <li>
                <Link href="/profile">Profile</Link>
              </li>
            )}
            <li>
              <Link href="/ai-chat">Ai Chat</Link>
            </li>
          </ul>
        </div>

        {/* <div>
          {user?.plan === "premium" && (
            <div className="flex gap-4">
              <Link
                rel="noreferrer noopener"
                href={process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL}
                target="_blank"
                className={`text-base bg-accent ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                Billing Portal
              </Link>
              <Button
                asChild
                className="flex gap-1 items-center bg-gradient-custom font-bold"
              >
                <div>
                  <Link href="/articles">Premium</Link>
                  <Sparkles width={16} height={16} className="text-[#FFD866]" />
                </div>
              </Button>
            </div>
          )}
        </div> */}
        <div>
          {user ? (
            <Button asChild variant="destructive">
              <Link href="/login" onClick={logoutHandler}>
                Logout
              </Link>
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
