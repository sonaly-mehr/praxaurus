"use server";

import User from "../../../models/user";
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { loginSchema, registerSchema } from '../../../lib/validation';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../../../lib/jwt';
import { connectToDatabase } from "../../../lib/utils";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


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

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email,
      name,
    });

    // Create new user with Stripe customer ID
    const newUser = new User({
      name,
      email,
      password,
      stripeCustomerId: customer.id, // Save Stripe customer ID
    });

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

    // Set cookies without production-based logic
    cookies().set('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'None',
      path: '/',
    });
    cookies().set('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      path: '/',
    });

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


// Server Action: subscribeUser
export async function subscribeUser({ userId, priceId }) {
  try {
    await connectToDatabase();

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return { error: 'User not found' };
    }

    // Create a Stripe checkout session for the subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: user.stripeCustomerId,
      line_items: [
        {
          price: priceId, // Replace with your Stripe Price ID
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return { url: session.url }; // Return the checkout session URL
  } catch (error) {
    console.error('Subscription Error:', error);
    return { error: 'An error occurred while creating the subscription.' };
  }
}