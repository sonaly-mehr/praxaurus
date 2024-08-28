"use client";
import { useState } from "react";
import { loginUser } from "../../../app/action";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// import { useFormState } from "react-dom";
// import { useEffect } from "react";
// import ErrorToast from "../Toasts/ErrorToast";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser({ email, password });
      toast.success("Logged in successfully");
      router.push("/")
      setError("");
    } catch (error) {
      toast.error(error.message);
    }
  };
  // const initialState = { message: "", status: undefined };
  // const [state, formAction] = useFormState(loginUser, initialState);

  // useEffect(() => {
  //   if (state.status === "success") {
  //     toast.success(state.message);
  //     router.push("/");
  //   } else if (state.status === "error") {
  //     toast.error(state.message);
  //   }
  // }, [state]);
  return (
    <form
      // action={formAction}
      // action={async (formData) => {
      //   // "use server"
      //   const email = formData.get("email");
      //   const password = formData.get("password");

      //   if (!email || !password) {
      //     // return <ErrorToast text="Please proive all the feilds!"/>
      //     return toast.error("Please proive all the feilds!");
      //   }
      //   const toastId = toast.loading("Logging in..");
      //   const error = await loginUser(email, password);
      //   if (!error) {
      //     toast.success("Login Successful!", {
      //       id: toastId,
      //     });
      //     router.push("/");
      //   } else {
      //     toast.error(String(error), {
      //       id: toastId,
      //     });
      //   }
      // }}
    >
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input type="email" name="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input type="password" name="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
      </div>

      <div className="flex flex-col mt-5">
        <Button onClick={handleLogin} size="lg">
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
