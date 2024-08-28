"use server";

// import { hash } from "bcryptjs";
import User from "../models/user";
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { loginSchema, registerSchema } from '../lib/validation';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../lib/jwt';
// import { signIn } from "next-auth/react";  // Correct import
import { connectToDatabase } from "../lib/utils";

// export const registerUser = async (prevState, formData) => {
//   const name = formData.get("name");
//   const email = formData.get("email");
//   const password = formData.get("password");

//   if (!email || !password || !name) {
//     const state = {
//       status: "error",
//       message: "Please provide all fields!",
//     };
//     return state;
//   }

//   //connect database
//   await connectToDatabase();

//   const user = await User.findOne({ email });

//   if (user) {
//     const state = {
//       status: "error",
//       message: "User already exist!",
//     };
//     return state;
//   }

//   const hashedPassword = await hash(password, 10);

//   //create user
//   const userCreated = await User.create({
//     name,
//     email,
//     password: hashedPassword,
//   });
//   if (userCreated) {
//     const state = {
//       status: "success",
//       message: "User Registered Successfully!",
//     };
//     return state;
//   }
// };


// Server Action: registerUser
export async function registerUser({ name, email, password, confirmPassword }) {
  try {
    // Input validation with Zod
    registerSchema.parse({ name, email, password, confirmPassword });

    await connectToDatabase();

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('Email is already registered'); // Log the error for debugging purposes
      return { error: 'Email is already registered' }; // Return error response
    }

    // Create new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    return { success: true }; // Return success response if registration is successful
  } catch (error) {
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      console.error('Validation Error:', error); // Log validation errors for debugging
      // Extract the first error message from Zod
      return { error: error.errors[0].message };
    }

    console.error('Registration Error:', error); // Log other errors for further inspection
    return { error: 'An error occurred while registering. Please try again later.' }; // Return a generic error message
  }
}


export async function loginUser({ email, password }) {
  try {
    // Input validation with Zod
    loginSchema.parse({ email, password });

    await connectToDatabase();

    const user = await User.findOne({ email });

    // Validate user and password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.error('Invalid email or password attempt'); // Log error for debugging
      return { error: 'Invalid email or password' }; // Return a specific error object
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refreshToken in the database
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    cookies().set('accessToken', accessToken, { httpOnly: true, path: '/' });
    cookies().set('refreshToken', refreshToken, { httpOnly: true, path: '/' });

    return { success: true, accessToken };
  } catch (error) {
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      console.error('Validation Error:', error); // Log validation errors for debugging
      // Extract the first error message from Zod
      return { error: error.errors[0].message };
    }

    console.error('Login Error:', error); // Log other errors for further inspection
    return { error: 'An error occurred while registering. Please try again later.' }; // Return a generic error message
  }
}

export async function refreshAction() {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) {
    console.error('No refresh token found in cookies'); // Debugging
    throw new Error('No refresh token provided');
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
    console.log('Refresh Token Payload:', payload); // Debugging
  } catch (error) {
    console.error('Error verifying refresh token:', error); // Debugging
    throw new Error('Invalid refresh token');
  }

  await connectToDatabase();

  const user = await User.findById(payload.id);

  if (!user || user.refreshToken !== refreshToken) {
    console.error('User not found or refresh token mismatch'); // Debugging
    throw new Error('Invalid refresh token');
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshToken = newRefreshToken;
  await user.save();

  cookieStore.set('accessToken', newAccessToken, { httpOnly: true, path: '/' });
  cookieStore.set('refreshToken', newRefreshToken, { httpOnly: true, path: '/' });

  return { accessToken: newAccessToken };
}

//Get user

export async function getUser() {
  await connectToDatabase();

  // Extract the access token from cookies
  const accessToken = cookies().get('accessToken');

  if (!accessToken || !accessToken.value) {
    throw new Error('No access token found');
  }

  let decodedToken;
  try {
    // Verify and decode the token
    decodedToken = verifyAccessToken(accessToken.value);
    console.log('Decoded Token:', decodedToken); // Debugging: Log the decoded token
  } catch (error) {
    throw new Error('Invalid or expired token');
  }

  // Fetch user using the decoded ID from the token, converting it to a plain object
  const user = await User.findById(decodedToken.id).select('-password -refreshToken').lean(); // `.lean()` makes it a plain JS object

  if (!user) {
    console.error('User not found for ID:', decodedToken.id); // Debugging: Log missing user ID
    throw new Error('User not found');
  }

  return user;
}

export async function logoutUser() {
  const cookieStore = cookies();

  // Clear cookies
  cookieStore.set('accessToken', '', { maxAge: -1 });
  cookieStore.set('refreshToken', '', { maxAge: -1 });

  return { message: 'Logged out successfully' };
}