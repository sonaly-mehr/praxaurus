"use client";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import Link from "next/link";
// import { useFormState } from "react-dom";
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
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ name, email, password, confirmPassword });
      toast.success("Registration successful");
      // setSuccess('Registration successful');
      router.push("/login");
      // setError('');
    } catch (error) {
      toast.error(error.message);
    }
  };

  // const initialState = { message: "", status: undefined };
  // const [state, formAction] = useFormState(registerUser, initialState);

  // useEffect(() => {
  //   if (state.status === "success") {
  //     toast.success(state.message);
  //     router.push("/login");
  //   } else if (state.status === "error") {
  //     toast.error(state.message);
  //   }
  // }, [state]);
  return (
    <div className="flex h-screen w-full justify-center items-center">
      <form 
      // action={formAction}
      >
        <Card className="w-[400px] mx-auto ">
          <CardHeader>
            <CardTitle>Register</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <Input
                // name="name"
                placeholder="Enter your name"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="email"
                // name="email"
                placeholder="Enter your email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                // name="password"
                placeholder="Enter password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
                            <Input
                type="password"
                // name="password"
                placeholder="Re-enter password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button onClick={handleRegister} size="lg" className="w-full">
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
