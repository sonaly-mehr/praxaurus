
import NewsCard from '../components/layout/NewsCard'
import TrendyNews from '../components/layout/TrendyNews'
import { Pricing } from "../components/ui/Pricing";
import Threads  from "../components/layout/Threads";
import { fetchThreads } from './services/forum/action';

export default async function Home() {
  const threads = await fetchThreads();
  return (
    <main className="">
      <NewsCard/>
      <TrendyNews/>
      <Pricing/>
      <Threads threads={threads}/>
    </main>
  );
}
