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


export async function registerUser({ name, email, password, confirmPassword }) {
  // Input validation
  try {
    registerSchema.parse({ name, email, password, confirmPassword });
  } catch (error) {
    throw new Error(error.errors[0].message);
  }

  await connectToDatabase();

  // Check if the email or username already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error('Email is already registered');
    }
  }

  // Create new user
  const newUser = new User({ name, email, password });
  await newUser.save();

  // // Generate tokens
  // const accessToken = generateAccessToken(newUser);
  // const refreshToken = generateRefreshToken(newUser);

  // // Save refreshToken in the user document
  // newUser.refreshToken = refreshToken;
  // await newUser.save();

  // // Set cookies
  // cookies().set('accessToken', accessToken, { httpOnly: true, path: '/' });
  // cookies().set('refreshToken', refreshToken, { httpOnly: true, path: '/' });

  // return { accessToken };
}

// export const loginUser = async (email, password) => {
//   try {
//     await signIn("credentials", {
//       email,
//       password,
//       // redirect: true,
//       // redirectTo: "/",
//     });
//   } catch (error) {
//     return error.message;
//   }
// };

export async function loginUser({ email, password }) {
  // Input validation
  try {
    loginSchema.parse({ email, password });
  } catch (error) {
    throw new Error(error.errors[0].message);
  }

  await connectToDatabase();

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refreshToken in the database
  user.refreshToken = refreshToken;
  await user.save();

  // Set cookies
  cookies().set('accessToken', accessToken, { httpOnly: true, path: '/' });
  cookies().set('refreshToken', refreshToken, { httpOnly: true, path: '/' });

  return { accessToken };
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