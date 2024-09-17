"use server";
import Thread from "../../../models/threads";
import Reply from "../../../models/replies";
import { connectToDatabase } from "../../../lib/utils";

export const createThread = async (title, content, userId) => {
  await connectToDatabase();
  const newThread = new Thread({ title, content, user: userId });
  await newThread.save();
  return newThread.toObject();
};

export const createReply = async (content, threadId, userId) => {
  try {
    const newReply = await Reply.create({
      content,
      user: userId,
      thread: threadId,
    });

    // Find the corresponding thread and push the reply ID to its replies array
    await Thread.findByIdAndUpdate(threadId, {
      $push: { replies: newReply._id },
    });

    return newReply.toObject();
  } catch (error) {
    throw new Error("Failed to create reply");
  }
};

export const fetchThreads = async () => {
  await connectToDatabase();
  const threads = await Thread.find().sort({ createdAt: -1 }).lean();

  return threads;
};

export const fetchThreadById = async (id) => {
  await connectToDatabase();

  // Fetch the thread along with the user who posted it
  const thread = await Thread.findById(id)
    .populate("user") // Assuming 'user' is the reference field in your Thread schema
    .populate({
      path: "replies",
      populate: {
        path: "user",
      },
    })
    .lean();

  return thread;
};

// export const fetchRepliesByThreadId = async (threadId) => {
//   await connectToDatabase();
//   const replies = await Reply.find({ thread: threadId }).populate('user').sort({ createdAt: -1 }).lean();
//   return replies;
// };

export const fetchUserThreads = async (userId) => {
  await connectToDatabase();
  const threads = await Thread.find({ user: userId })
    .populate("user") // Populate user in threads
    .populate({
      path: "replies",
      populate: {
        path: "user", // Populate user in replies
      },
    })
    .sort({ createdAt: -1 })
    .lean();
  return threads;
};

export const deleteThreadById = async (threadId) => {
  await connectToDatabase();
  const thread = await Thread.findByIdAndDelete(threadId);

  if (thread) {
    // Delete all replies associated with the deleted thread
    await Reply.deleteMany({ thread: thread._id });

    return thread.toObject();
  }

  return null;
};


export const editReply = async (replyId, userId, newContent) => {
  await connectToDatabase();

  // Find the reply and check if the current user is the owner
  const reply = await Reply.findById(replyId);
  if (!reply) {
    throw new Error("Reply not found");
  }

  if (reply.user.toString() !== userId.toString()) {
    throw new Error("You are not authorized to edit this reply");
  }

  // Update the reply's content
  reply.content = newContent;
  await reply.save();

  return reply.toObject();
};

export const deleteReply = async (replyId, userId) => {
  await connectToDatabase();

  const reply = await Reply.findById(replyId);
  if (!reply) {
    throw new Error("Reply not found");
  }

  if (reply.user.toString() !== userId.toString()) {
    throw new Error("You are not authorized to delete this reply");
  }

  await Thread.findByIdAndUpdate(reply.thread, {
    $pull: { replies: replyId },
  });

  await Reply.findByIdAndDelete(replyId);

  return { success: true };
};