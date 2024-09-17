"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "../../../../contextApi/UserContext";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Textarea } from "../../../../components/ui/textarea";

const EditNews = ({ params }) => {
  const [loading, setLoading] = useState(null);
  const { id } = params;
  const { user } = useUser();
  const router = useRouter();
  const [news, setNews] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    author: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData({ ...formData, image: URL.createObjectURL(file) });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedData = { ...formData };

    // If an image is selected, upload it and get the URL
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      try {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Failed to upload image");

        const uploadData = await uploadRes.json();
        updatedData.image = uploadData.url;
      } catch (error) {
        toast.error(`Image upload error: ${error.message}`);
        return;
      }
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/news/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        toast.success("News updated successfully!");
        router.push("/"); // Redirect after success
        setLoading(false);
      } else {
        throw new Error("Failed to update news");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  if (!user?.role === "admin") {
    return <div>Unauthorized</div>;
  }

  if (!news) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-1/2 mx-auto mt-10 mb-20">
      <h1 className="mb-4 font-semibold text-lg">Edit News</h1>
      <form onSubmit={handleUpdate} className="flex flex-col gap-3">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
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
        {formData.image && (
          <img
            src={formData.image}
            alt="Current news image"
            className="my-4 w-40"
          />
        )}
        <Label htmlFor="file">Update Image</Label>
        <Input
          id="file"
          type="file"
          onChange={handleImageChange}
          className="cursor-pointer"
        />
        <Button type="submit" className="mt-5 w-[40%] mx-auto">
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-200"></div>
          ) : (
            "Update"
          )}
        </Button>
      </form>
    </div>
  );
};

export default EditNews;
