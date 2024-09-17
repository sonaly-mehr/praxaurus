import Link from "next/link";
import CreateThreads from "../ui/Threads/CreateThread";
import { Button } from "../ui/button";
import { truncateText } from "../../lib/utils";

export default function Thread({ threads }) {
  const maxWords = 20;
  return (
    <div className="container mb-20 border border-solid border-gray-200 pt-5 pb-14">
      <CreateThreads />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        {threads?.length > 0 ? (
          threads?.map((thread) => (
            <div
              key={thread._id}
              className="px-8 py-6 bg-white shadow rounded-md flex flex-col gap-1"
            >
              <h2 className="text-xl font-bold">{thread.title}</h2>
              <p className="flex-grow mb-3 text-sm">
                {truncateText(thread.content, maxWords)}
              </p>
              <Button
                asChild
                variant="outlined"
                className="border border-blue-500 w-fit mt-auto"
              >
                <Link href={`/threads/${thread._id}`} className="text-blue-500">
                  View Thread
                </Link>
              </Button>
            </div>
          ))
        ) : (
          <p className="text-xl text-center w-full">No Threads Found!</p>
        )}
      </div>
    </div>
  );
}