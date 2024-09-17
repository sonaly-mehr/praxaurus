import { NextResponse } from 'next/server';
import cloudinary from '../../../cloudinaryConfig';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'news_images' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({ url: uploadResponse });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}