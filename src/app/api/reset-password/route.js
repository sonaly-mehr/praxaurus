import { resetPassword } from '../../services/auth/action';
import { NextResponse } from 'next/server';


export async function POST(request) {
  try {
    // Extract the token and newPassword from the request body
    const { token, newPassword } = await request.json();
    
    console.log("Received token:", token);  // Log the received token

    // Ensure that the token and newPassword are provided
    if (!token || !newPassword) {
      throw new Error("Token and newPassword must be provided");
    }

    // Call the resetPassword function with the token and newPassword
    await resetPassword({ token, newPassword });

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error during password reset:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}