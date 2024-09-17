import User from '../models/user';
import { sendResetEmail } from './sendResetEmail';

import crypto from 'crypto';

export async function generateResetToken(email) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  // Generate a random reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Save the reset token and expiry time to the user
  user.resetToken = resetToken;
  user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
  await user.save();

  // Create the reset link
  const production = process.env.NEXT_PUBLIC_SERVER
  const resetLink = `${production == production ? process.env.NEXT_PUBLIC_URL : 'http://localhost:3000'}/reset-password?token=${resetToken}`;

  // Send the reset email
  await sendResetEmail(user.email, resetLink);
  
  return { success: true };
}

// export function verifyResetToken(token) {
//   try {
//     const decoded = jwt.verify(token, RESET_TOKEN_SECRET); // Use the reset token secret
//     return decoded.id; // Return the user ID if valid
//   } catch (error) {
//     return null; // Return null if the token is invalid or expired
//   }
// }