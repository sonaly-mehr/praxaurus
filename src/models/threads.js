import mongoose from 'mongoose';

const threadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Thread || mongoose.model('Thread', threadSchema);