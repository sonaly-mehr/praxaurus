"use server";

import User from "../../../models/users";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { loginSchema, registerSchema } from "../../../lib/validation";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../../../lib/jwt";
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
      console.error("Email is already registered");
      return { error: "Email is already registered" };
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email,
      name,
    });

    const newUser = new User({
      name,
      email,
      password,
      customerId: customer.id || null,
    });

    await newUser.save();

    return { success: true };
  } catch (error) {
    // Handle Zod validation errors
    if (error.name === "ZodError") {
      console.error("Validation Error:", error);
      return { error: error.errors[0].message };
    }

    console.error("Registration Error:", error);
    return {
      error: "An error occurred while registering. Please try again later.",
    };
  }
}

export async function loginUser({ email, password }) {
  try {
    // Input validation with Zod
    loginSchema.parse({ email, password });

    await connectToDatabase();

    const user = await User.findOne({ email });

    // Validate user and password
    if (!user) {
      console.error("Invalid email or password attempt");
      return { error: "Invalid email or password" };
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log("Is Password Match:", isPasswordMatch); // Log the password match result

    if (!isPasswordMatch) {
      console.error("Invalid email or password attempt");
      return { error: "Invalid email or password" };
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refreshToken in the database
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies with SameSite=None and Secure attributes
    cookies().set("accessToken", accessToken, {
      httpOnly: true,
      secure: true, // Ensure this is only true in HTTPS environments
      sameSite: "None",
      path: "/",
    });
    cookies().set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // Ensure this is only true in HTTPS environments
      sameSite: "None",
      path: "/",
    });

    return { success: true, accessToken };
  } catch (error) {
    if (error.name === "ZodError") {
      console.error("Validation Error:", error);
      return { error: error.errors[0].message };
    }

    console.error("Login Error:", error);
    return {
      error: "An error occurred while logging in. Please try again later.",
    };
  }
}

export async function refreshAction() {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    console.error("No refresh token found in cookies");
    throw new Error("No refresh token provided");
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
    console.log("Refresh Token Payload:", payload);
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    throw new Error("Invalid refresh token");
  }

  await connectToDatabase();

  const user = await User.findById(payload.id);

  if (!user || user.refreshToken !== refreshToken) {
    console.error("User not found or refresh token mismatch");
    throw new Error("Invalid refresh token");
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshToken = newRefreshToken;
  await user.save();

  cookieStore.set("accessToken", newAccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });
  cookieStore.set("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });

  return { accessToken: newAccessToken };
}

//Get user

export async function getUser() {
  await connectToDatabase();

  // Extract the access token from cookies
  const accessToken = cookies().get("accessToken");

  if (!accessToken || !accessToken.value) {
    // throw new Error('No access token found');
  }

  let decodedToken;
  try {
    // Verify and decode the token
    decodedToken = verifyAccessToken(accessToken.value);
    console.log("Decoded Token:", decodedToken);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }

  // Fetch user using the decoded ID from the token, converting it to a plain object
  const user = await User.findById(decodedToken.id)
    .select("-password -refreshToken")
    .lean(); // `.lean()` makes it a plain JS object

  if (!user) {
    console.error("User not found for ID:", decodedToken.id); // Debugging: Log missing user ID
    throw new Error("User not found");
  }

  return user;
}

export async function logoutUser() {
  const cookieStore = cookies();

  // Clear cookies
  cookieStore.set("accessToken", "", { maxAge: -1 });
  cookieStore.set("refreshToken", "", { maxAge: -1 });

  return { message: "Logged out successfully" };
}

// Server Action: subscribeUser
export async function subscribeUser({ userId, priceId }) {
  try {
    await connectToDatabase();

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return { error: "User not found" };
    }

    // Create a Stripe checkout session for the subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
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
    console.error("Subscription Error:", error);
    return { error: "An error occurred while creating the subscription." };
  }
}
export async function resetPassword({ token, newPassword }) {
  const now = Date.now();
  console.log("Current Time:", new Date(now).toISOString());
  console.log("Received Token:", token);

  // Step 1: Find user by resetToken
  const user = await User.findOne({ resetToken: token });
  
  if (!user) {
    console.log('No user found with this token');
    throw new Error('Invalid reset token');
  }

  // Step 2: Check token expiry
  console.log("Token Expiry Time:", new Date(user.resetTokenExpiry).toISOString());

  if (user.resetTokenExpiry <= now) {
    console.log('Token has expired');
    throw new Error('Expired reset token');
  }

  // Step 3: Update user with new password
  user.password = newPassword; // Set new password directly
  // user.skipPasswordHashing = false; // Ensure flag is reset
  user.resetToken = null;
  user.resetTokenExpiry = null;
  
  await user.save();

  console.log("Password reset successfully.");
}