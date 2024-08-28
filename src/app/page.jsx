
// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "./api/auth/[...nextauth]/route";

// import { Button } from "@/components/ui/button";
import Navbar from "../components/ui/Navbar";
import NewsCard from '../components/layout/NewsCard'
import TrendyNews from '../components/layout/TrendyNews'
// import LoginForm from "../../components/LoginForm";

export default async function Home() {
  // const session = await getServerSession(authOptions);

  // if (session) redirect("/dashboard");

  return (
    <main className="">
      <Navbar/>
      {/* <LoginForm /> */}
      {/* <Button>Click</Button> */}
      <NewsCard/>
      <TrendyNews/>
    </main>
  );
}
