"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const categories = ["golf", "cycle", "rugby"];

export default function CreateNewsForm() {
  const [loading, setLoading] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("name", description);
    formData.append("category", category);
    formData.append("author", author);
    formData.append("image", image);

    try {
      setLoading(true);
      const res = await fetch("/api/news", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.status === 200) {
        toast.success("News created successfully");
        setLoading(false);
        setName("");
        setDescription("");
        setCategory(categories[0]);
        setAuthor("");
        setImage(null);
        router.refresh(); // Refresh the page or do any other UI update
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-custom text-base">Create News</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            placeholder="News Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Textarea
            placeholder="News Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Select
            value={category}
            onValueChange={(value) => setCategory(value)}
            required
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
          <Button type="submit"> {loading ? "Submitting.." : "Submit"}</Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}
