"use client";

import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { useUser } from "../../contextApi/UserContext";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";

const PaymentLink = ({ paymentLink, text }) => {
  const router = useRouter();
  const { user } = useUser();
  console.log("user info", user);
  const handleClick = () => {
    if (!user) {
      toast.error("Please login first!");
      router.push("/login");
    } 
    else{
      router.push(paymentLink + `?prefilled_email=${user?.email}`);
    }
    // else {
    //   router.push(stripePaymentLink + `?prefilled_email=${user.email}`);
    // }
  };
  return (
    <span
      //   href={user ? paymentLink : "/login"}
      className={`${buttonVariants()} cursor-pointer`}
      onClick={()=> handleClick()}
      // onClick={() => {
      // 	if (paymentLink) {
      // 		localStorage.setItem("stripePaymentLink", paymentLink);
      // 	}
      // }}
    >
      {text}
    </span>
  );
};
export default PaymentLink;
