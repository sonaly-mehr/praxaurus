"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner"; // Import toast

const NewsDetails = ({ params }) => {
  const router = useRouter();
  const [news, setNews] = useState(null);

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        const res = await fetch(`/api/news/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch news details");

        const result = await res.json();
        setNews(result?.data || {});
      } catch (error) {
        console.error("Error fetching news details:", error);
      }
    };

    fetchNewsDetails();
  }, [params.id]);

  if (!news) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-12 px-6 lg:px-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Section: Image */}
        <div className="lg:w-1/2">
          <Image
            src={news?.image || "/default-image.png"}
            alt={news?.name || "News Image"}
            width={800}
            height={500}
            className="rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* Right Section: News Details */}
        <div className="lg:w-1/2 flex flex-col justify-between">
          {/* News Info */}
          <div className="mt-8 lg:mt-0">
            <h1 className="text-4xl font-bold mb-4">{news?.name || "Untitled News"}</h1>
            <div className="flex flex-col gap-3 mb-6">
              <span className="text-gray-600">
                By <strong>{news?.author || "Unknown Author"}</strong>
              </span>
              <span className="text-gray-500">
                {news?.createdAt
                  ? new Date(news?.createdAt).toLocaleDateString()
                  : "Unknown Date"}
              </span>
              <span className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md w-fit">
                {news?.category || "Unknown Category"}
              </span>
            </div>

            {/* News Description */}
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {news?.description || "No description available for this news."}
            </p>
          </div>
        </div>
      </div>

      {/* Related News Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-4">Related News</h3>
        <ul className="flex flex-col gap-4">
          <li>
            <Link href="/news/related-news-1" className="text-blue-500 hover:underline">
              Related News 1
            </Link>
          </li>
          <li>
            <Link href="/news/related-news-2" className="text-blue-500 hover:underline">
              Related News 2
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NewsDetails;