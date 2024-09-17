"use client";
import React from "react";
import { useUser } from "../../../contextApi/UserContext";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const page = () => {
  const { user } = useUser();
  const router = useRouter()
  if (!user) return router.push("/login");
  return (
    <div className="container">
      <div className="border border-gray-300 p-4">
        <h2 className="text-center text-lg">
          Welcome <span className="font-bold">{user?.name}!</span>
        </h2>
        <div className="flex gap-4 justify-center mt-5">
          <Button asChild size="lg" className="text-base">
            <Link href="/profile/billing">Billing</Link>
          </Button>
          <Button asChild size="lg" className="text-base">
            <Link href="/profile/threads">Threads</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
