import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ["golf", "cycle", "rugby"], required: true },
  author: { type: String, required: true },
  image: { type: String, required: true }, // Store image URL or path
  type: { type: String, enum: ["free", "premium"], default: "free" },
  createdAt: { type: Date, default: Date.now },
});

const News = mongoose.models.News || mongoose.model("News", NewsSchema);

export default News;
