import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/utils";
import News from "../../../../models/news";

// GET method to fetch a single news entry for editing
export async function GET(req, { params }) {
  await connectToDatabase();
  const { id } = params;

  try {
    const news = await News.findById(id);
    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ status: 500, message: "Error fetching news" });
  }
}

export async function PUT(req, { params }) {
  await connectToDatabase();
  const { id } = params;
  const { name, category, author, image } = await req.json();

  try {
    await News.findByIdAndUpdate(
      id,
      { name, category, author, image },
      { new: true }
    );
    return NextResponse.json({
      status: 200,
      message: "News updated successfully",
    });
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json({ status: 500, message: "Error updating news" });
  }
}

export async function DELETE(req, { params }) {
  await connectToDatabase();
  const { id } = params;

  try {
    await News.findByIdAndDelete(id);
    return NextResponse.json({
      status: 200,
      message: "News deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json({ status: 500, message: "Error deleting news" });
  }
}
