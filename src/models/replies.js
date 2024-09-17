import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Reply || mongoose.model('Reply', replySchema);