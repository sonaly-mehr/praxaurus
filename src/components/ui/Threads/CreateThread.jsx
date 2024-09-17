"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogClose,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "../../../contextApi/UserContext";
import { createThread } from "../../../app/services/forum/action";

const CreateThread = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      toast.error("Title and Content are required.");
      return;
    }

    try {
      setLoading(true);
      const result = await createThread(title, content, user._id);
      console.log("Result", result);

      if (result) {
        toast.success("Thread created successfully");
        setTitle("");
        setContent("");
        setDialogOpen(false);
        router.refresh();
      } else {
        toast.error("Failed to create thread. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = () => {
    if (!user) {
      toast.error("You must be logged in to create a thread.");
      router.push("/login");
    } else {
      setDialogOpen(true);
    }
  };

  return (
    <div className="w-full flex justify-end">
      <Button
        onClick={() => handleDialogOpen()}
        className="bg-gradient-custom text-base w-fit"
      >
        Start Threads
      </Button>

      {dialogOpen && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {" "}
                <p className="text-sm text-center">
                  Share your thread with our community!
                </p>
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <Button type="submit">
                {loading ? "Submitting.." : "Submit"}
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CreateThread;
