import { v2 as cloudinary } from 'cloudinary';
import { connectToDatabase } from '../../../lib/utils'
import News from '../../../models/news'; // Adjust path if needed

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createNews({ name, category, author, image }) {
  await connectToDatabase();

  try {
    let imageUrl = '';

    if (image) {
      // Upload image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: 'news_images', // Optional: specify a folder in Cloudinary
      });
      imageUrl = uploadResult.secure_url;
    }

    // Create and save news entry
    const news = new News({
      name,
      category,
      author,
      image: imageUrl,
      type: 'free', // Default type or adjust as needed
    });

    await news.save();
    return { status: 200, message: 'News created successfully' };
  } catch (error) {
    console.error('Error creating news:', error);
    return { status: 500, message: 'Error creating news' };
  }
}