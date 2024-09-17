"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  deleteThreadById,
  fetchUserThreads,
} from "../../../../app/services/forum/action";
import { useUser } from "../../../../contextApi/UserContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../../../../components/ui/dialog";
import { Trash2 } from "lucide-react";
import { Button } from "../../../../components/ui/button";

const UserThreads = () => {
  const { user } = useUser();
  const id = user?._id;
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [threadToDelete, setThreadToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const threadsData = await fetchUserThreads(id);
          setThreads(threadsData);
        }
      } catch (error) {
        toast.error("Failed to fetch threads");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    // if (!threadToDelete) return; // Ensure there is a thread to delete
    try {
      const result = await deleteThreadById(threadToDelete);
      if (result) {  // Assuming the API returns a success flag
        toast.success("Thread deleted successfully");
        setIsDialogOpen(false);  // Close the dialog
        setThreadToDelete(null); // Reset threadToDelete
        window.location.reload(); // Refresh the page
      } else {
        throw new Error("Failed to delete thread");
      }
    } catch (error) {
      toast.error("Failed to delete thread");
    }
  };

  if (loading) {
    return <div className="container text-lg mt-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto my-10">
      <h1 className="text-3xl font-bold mb-6">Your Threads</h1>
      {threads?.length > 0 ? (
        threads.map((thread) => (
          <div
            key={thread._id}
            className="bg-white p-6 shadow-md rounded-md mb-6 relative"
          >
            <h2 className="text-xl font-semibold mb-4">{thread.title}</h2>
            <p className="text-base mb-4">{thread.content}</p>
            <div className="flex items-center gap-2 mb-4">
              <img
                src={
                  thread.user.profileImage ||
                  "https://cdn-icons-png.freepik.com/512/6806/6806997.png"
                }
                alt={thread.user.name || "User"}
                className="w-10 h-10 rounded-full"
              />
              <p className="text-sm text-gray-500">
                Posted by {thread.user.name || "Anonymous"} on{" "}
                {new Date(thread.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => {
                setThreadToDelete(thread._id); // Set the thread to delete
                setIsDialogOpen(true); // Open the dialog
              }}
              className="absolute right-5 top-5 text-red-500 hover:text-red-700"
              aria-label="Delete"
            >
              <Trash2 size={22} />
            </button>

            {/* Confirmation Dialog */}
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                if (!open) {
                  setThreadToDelete(null); // Reset thread to delete when dialog is closed
                }
                setIsDialogOpen(open);
              }}
            >
              <DialogContent>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this thread?
                </DialogDescription>
                <DialogFooter>
                  <DialogClose onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </DialogClose>
                  <Button
                    onClick={handleDelete}
                    className="bg-red-500 text-white"
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Replies Section */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Replies</h3>
              {thread.replies.length > 0 ? (
                thread.replies.map((reply) => (
                  <div
                    key={reply._id}
                    className="mb-4 p-4 bg-gray-50 rounded-md border"
                  >
                    <div className="flex items-center mb-2">
                      <img
                        src={
                          reply.user.profileImage ||
                          "https://cdn-icons-png.freepik.com/512/6806/6806997.png"
                        }
                        alt={reply.user.name || "User"}
                        className="w-7 h-7 rounded-full mr-2"
                      />
                      <div>
                        <span className="font-semibold">
                          {reply.user.name || "Anonymous"}
                        </span>
                        <span className="ml-2 text-sm text-gray-400">
                          replied on{" "}
                          {new Date(reply.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <p>{reply.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No replies yet.</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No threads found.</p>
      )}
    </div>
  );
};

export default UserThreads;