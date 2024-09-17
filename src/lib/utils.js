import { clsx } from "clsx"
import mongoose from "mongoose"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const connectToDatabase = async () => {
  try {
    if(mongoose.connections && mongoose.connections[0].readyState) return;

    const {connection} = await mongoose.connect(
      process.env.MONGODB_URI,
      {
        dbName: "Praxaurus"
      }
    );
    console.log(`Connected to database: ${connection.host}`);
  
  } catch (error) {
    throw new 
    Error("Error connecting to database")
  }
}

export function truncateText(text, maxWords) {
  const words = text.split(' ');
  if (words.length <= maxWords) {
    return text;
  }
  return words.slice(0, maxWords).join(' ') + '...';
}