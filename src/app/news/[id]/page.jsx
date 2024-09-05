"use client";
import React, { useEffect, useState } from "react";

import { useUser } from "../../../contextApi/UserContext";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Textarea } from "../../../components/ui/textarea";

const EditNews = ({ params }) => {
  const { id } = params;
  const { user } = useUser();
  const router = useRouter();
  // const { id } = router.query;
  const [news, setNews] = useState(null);
  console.log("single news", news);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    author: "",
    image: "",
  });

  useEffect(() => {
    if (id) {
      const fetchNews = async () => {
        try {
          const res = await fetch(`/api/news/${id}`);
          if (!res.ok) throw new Error("Failed to fetch news");
          const data = await res.json();
          setNews(data);
          setFormData({
            name: data.name,
            description: data.description,
            category: data.category,
            author: data.author,
            image: data.image,
          });
        } catch (error) {
          console.error("Error fetching news:", error);
        }
      };
      fetchNews();
    }
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/news/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("News updated successfully!");
        router.push("/"); // Redirect after success
      } else {
        throw new Error("Failed to update news");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  if (!user?.role === "admin") {
    return <div>Unauthorized</div>;
  }

  if (!news) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-1/2 mx-auto mt-10">
      <h1 className="mb-4 font-semibold text-lg">Edit News</h1>
      <form onSubmit={handleUpdate} className="flex flex-col gap-3">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <Label htmlFor="name">Description</Label>
        <Textarea
          id="category"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        />
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
        />
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        />
        <Button type="submit" className="mt-5 w-[40%] mx-auto">
          Update
        </Button>
      </form>
    </div>
  );
};

export default EditNews;
