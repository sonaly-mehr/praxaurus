"use client";
import { useState } from "react";
import { loginUser } from "../../../app/services/auth/action";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await loginUser({ email, password });

    if (response.error) {
      // Show error message from server
      toast.error(response.error);
      setError(response.error);
    } else {
      toast.success("Logged in successfully");
      window.location.href = "/";
      setError("");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="flex flex-col mt-5">
        <Button type="submit" size="lg">
          Submit
        </Button>
        <span className="text-[13px] block text-center mt-1">
          Don't have an account?{" "}
          <Link href="/register" className="text-green-600 text-[13px]">
            Sign Up
          </Link>
        </span>
      </div>
    </form>
  );
};

export default LoginForm;