"use client";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import Link from "next/link";
import { registerUser } from "../action";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await registerUser({ name, email, password, confirmPassword });

    if (response.error) {
      // Display error message from server response
      toast.error(response.error);
      setError(response.error);
    } else {
      toast.success("Registration successful");
      router.push("/login");
      setError("");
    }
  };

  return (
    <div className="flex h-screen w-full justify-center items-center">
      <form onSubmit={handleRegister}>
        <Card className="w-[400px] mx-auto">
          <CardHeader>
            <CardTitle>Register</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <Input
                placeholder="Enter your name"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Enter your email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Enter password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Re-enter password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" size="lg" className="w-full">
              Submit
            </Button>
            <span className="text-[13px] block text-center mt-1">
              Already have an account?{" "}
              <Link href="/login" className="text-green-600 text-[13px]">
                Sign In
              </Link>
            </span>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}