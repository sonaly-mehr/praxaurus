"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useUser } from "../../contextApi/UserContext";
import CreateNewsForm from "./CreateNewsForm";
import { FilePenLine, Trash } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Banner = () => {
  const { user } = useUser();
  const router = useRouter();
  const [newsData, setNewsData] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news", {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch news");
        }

        const result = await res.json();
        setNewsData(result.data || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  const handleEdit = (id) => {
    router.push(`/news/edit/${id}`);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        const res = await fetch(`/api/news/${deleteId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          toast.error("Failed to delete news");
        } else {
          toast.success("News deleted successfully!");
          setNewsData(newsData.filter((news) => news._id !== deleteId));
          setDeleteId(null);
          setIsDialogOpen(false);
        }
      } catch (error) {
        console.error("Error deleting news:", error);
      }
    }
  };

  return (
    <div className="container mx-auto my-16">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-3xl mb-6">Trendy News</h3>
        {user?.role === "admin" && <CreateNewsForm />}
      </div>

      <div className="grid grid-col-1 lg:grid-cols-2 gap-8">
        {newsData.length > 0 ? (
          newsData.map((news, index) => (
            <div
              
              className="flex gap-4 cursor-pointer"
              key={index}
            >
              <div>
                <Image
                  src={news?.image || "/default-image.png"}
                  alt={news?.name || "News Image"}
                  width={250}
                  height={400}
                  className="w-[400px] h-full"
                />
              </div>
              <div className="flex flex-col gap-4">
                <span className="bg-blue-500 text-[11px] lg:text-xs uppercase font-medium w-fit text-white px-3 py-1 inline-block">
                  {news?.category || "Unknown Category"}
                </span>
                <Link href={`/news/details/${news?._id}`} className="text-black text-base lg:text-2xl font-semibold hover:underline transition delay-100 ease-in-out">
                  {news?.name || "Untitled News"}
                </Link>
                <div className="flex flex-col gap-3">
                  <span className="text-gray-500 text-[15px]">
                    By {news?.author || "Unknown Author"}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {news?.createdAt
                      ? new Date(news?.createdAt).toLocaleDateString()
                      : "Unknown Date"}
                  </span>
                </div>
                {user?.role === "admin" && (
                  <div className="flex gap-3 items-center mt-3">
                    <Button
                      onClick={() => handleEdit(news._id)}
                      className="text-[#3B82F6] bg-gray-100"
                    >
                      <FilePenLine />
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger>
                        <Button
                          onClick={() => {
                            setDeleteId(news._id);
                            setIsDialogOpen(true); // Open the dialog
                          }}
                          className="text-red-500 bg-gray-100"
                        >
                          <Trash />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this news item?
                        </DialogDescription>
                        <DialogFooter>
                          <DialogClose onClick={() => setIsDialogOpen(false)}>
                            Cancel
                          </DialogClose>
                          <Button
                            onClick={() => {
                              handleDelete(); // Call handleDelete and close dialog
                            }}
                            className="bg-red-500 text-white"
                          >
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div>No news data available</div>
        )}
      </div>
    </div>
  );
};

export default Banner;
