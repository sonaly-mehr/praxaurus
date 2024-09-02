
import NewsCard from '../components/layout/NewsCard'
import TrendyNews from '../components/layout/TrendyNews'
import { Pricing } from "../components/ui/Pricing";

export default async function Home() {
  return (
    <main className="">
      <NewsCard/>
      <TrendyNews/>
      <Pricing/>
    </main>
  );
}
