import nodemailer from 'nodemailer';

// Use simple SMTP transporter with Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',   // Gmail SMTP host
  port: 587,                // Use 587 for TLS
  secure: false,            // False because we're using STARTTLS
  auth: {
    user: process.env.EMAIL_USER,  // Gmail email address
    pass: process.env.EMAIL_PASS,  // App Password (if using 2FA)
  },
});

// Function to send reset email
export async function sendResetEmail(to, resetLink) {
  const mailOptions = {
    from: "Praxaurus",  // Use a recognizable name for the sender
    to,                                                   // Recipient's email
    subject: 'Reset your password',                       // Keep the subject simple and non-promotional
    html: `
      <p>Hello,</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetLink}" style="color: #3366cc;">Reset your password</a>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thank you,<br>Praxaurus, Support Team!</p>
    `,  // Keep email content simple and professional
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending reset email');
  }
}