import { NextResponse } from 'next/server';
import cloudinary from '../../../cloudinaryConfig';
import { connectToDatabase } from '../../../lib/utils';
import News from '../../../models/news';

export async function POST(req) {
  await connectToDatabase();

  try {
    const formData = await req.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const category = formData.get('category');
    const author = formData.get('author');
    const imageFile = formData.get('image');

    let imageUrl = '';

    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      // Cloudinary upload wrapped in a Promise to use async/await
      imageUrl = await new Promise((resolve, reject) => {
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
    }

    // Ensure the image URL was set correctly
    if (!imageUrl) {
      throw new Error('Image upload failed');
    }

    // Create and save news entry
    const news = new News({
      name,
      description,
      category,
      author,
      image: imageUrl,
      type: 'free', // Default type or adjust as needed
    });

    await news.save();
    return NextResponse.json({ status: 200, message: 'News created successfully' });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json({ status: 500, message: 'Error creating news' });
  }
}

// GET method to fetch all news entries
export async function GET() {
  await connectToDatabase();

  try {
    const news = await News.find(); // Fetch all news entries from the database
    return NextResponse.json({ status: 200, data: news });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ status: 500, message: 'Error fetching news' });
  }
}