"use client";

import { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../../../../components/ui/dialog"; // Assuming you're using a Dialog component
import { useUser } from "../../../../contextApi/UserContext";
import {
  fetchThreadById,
  createReply,
  deleteReply,
  editReply,
} from "../../../../app/services/forum/action";

export default function ThreadDetails({ params }) {
  const [thread, setThread] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingReplyId, setEditingReplyId] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog
  const [replyToDelete, setReplyToDelete] = useState(null); // State for reply to delete

  useEffect(() => {
    const fetchThreadAndReplies = async () => {
      try {
        const threadData = await fetchThreadById(params.id);
        setThread(threadData);
      } catch (error) {
        toast.error("Failed to fetch thread or replies");
      }
    };

    fetchThreadAndReplies();
  }, [params.id]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!replyContent.trim()) {
      toast.error("Reply content cannot be empty");
      setLoading(false);
      return;
    }

    try {
      if (editingReplyId) {
        await handleSaveEdit(e);
      } else {
        await createReply(replyContent, params.id, user._id);
        toast.success("Your reply posted successfully!");
      }

      setReplyContent("");
      setEditingReplyId(null);
      const updatedThread = await fetchThreadById(params.id); // Re-fetch the updated thread
      setThread(updatedThread);
    } catch (error) {
      toast.error("Failed to post or edit reply");
    }

    setLoading(false);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!replyContent.trim()) {
      toast.error("Reply content cannot be empty");
      return;
    }

    try {
      await editReply(editingReplyId, user._id, replyContent);
      toast.success("Your reply has been edited!");

      // Re-fetch the updated thread
      const updatedThread = await fetchThreadById(params.id);
      setThread(updatedThread);
      setEditingReplyId(null); // Clear editing state
      setReplyContent(""); // Clear input field
    } catch (error) {
      toast.error("Failed to edit reply");
    }
  };

  const openDeleteDialog = (replyId) => {
    setReplyToDelete(replyId);
    setIsDialogOpen(true);
  };
  const handleEditReply = (replyId) => {
    // Find the reply by ID
    const replyToEdit = thread?.replies?.find((reply) => reply._id === replyId);

    if (replyToEdit) {
      // Set the reply content to the selected reply's content for editing
      setReplyContent(replyToEdit.content);
      setEditingReplyId(replyId); // Set the editing reply ID
    }
  };

  const handleConfirmDelete = async () => {
    if (replyToDelete) {
      try {
        await deleteReply(replyToDelete, user._id);
        toast.success("Reply deleted successfully!");

        // Re-fetch the updated thread
        const updatedThread = await fetchThreadById(params.id);
        setThread(updatedThread);

        setIsDialogOpen(false); // Close the dialog after deletion
        setReplyToDelete(null); // Clear the reply to delete
      } catch (error) {
        toast.error("Failed to delete reply");
      }
    }
  };

  if (!thread) {
    return <div className="container text-lg mt-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto my-10">
      {/* Thread Details */}
      <div className="bg-white p-6 shadow-md rounded-md mb-6">
        <div className="mb-4">
          <h1 className="text-xl font-bold mb-2">{thread?.title}</h1>
          <p className="text-base mb-4">{thread?.content}</p>
          <div className="flex items-center gap-2">
            <img
              src={
                thread?.user.profileImage ||
                `https://cdn-icons-png.freepik.com/512/6806/6806997.png`
              }
              alt={thread?.user.name || "User"}
              className="w-10 h-10 rounded-full"
            />
            <p className="text-sm text-gray-500">
              Posted by {thread?.user.name || "Anonymous"} on{" "}
              {new Date(thread?.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Reply Section */}
      <div className="bg-white p-6 shadow-md rounded-md">
        <h2 className="text-xl font-semibold mb-4">Replies</h2>
        {thread?.replies?.length > 0 ? (
          thread?.replies?.map((reply) => (
            <div
              key={reply?._id}
              className="mb-4 p-4 bg-gray-50 rounded-md border"
            >
              <div className="flex items-center mb-2">
                <img
                  src={
                    reply?.user?.profileImage ||
                    `https://cdn-icons-png.freepik.com/512/6806/6806997.png`
                  }
                  className="w-7 h-7 rounded-full mr-2"
                />
                <div>
                  <span className="font-semibold">
                    {reply?.user?.name || "Anonymous"}
                  </span>
                  <span className="ml-2 text-sm text-gray-400">
                    replied on {new Date(reply?.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <p>{reply?.content}</p>
              {reply?.user?._id === user?._id && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEditReply(reply?._id)}
                    className="text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteDialog(reply?._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No replies yet.</p>
        )}

        {user ? (
          <form onSubmit={handleReplySubmit} className="mt-6 space-y-4">
            <Textarea
              placeholder="Write your reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="bg-blue-600 text-white"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Reply"}
            </Button>
          </form>
        ) : (
          <p className="text-gray-600 mt-4 text-sm">
            You must be logged in to post a reply.
          </p>
        )}
      </div>

      {/* Confirmation Dialog */}
      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this reply?
            </DialogDescription>
            <DialogFooter>
              <DialogClose onClick={() => setIsDialogOpen(false)}>
                Cancel
              </DialogClose>
              <Button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
