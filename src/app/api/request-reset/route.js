
import { NextResponse } from 'next/server';
import { generateResetToken } from '../../../lib/auth'; // Adjust the path as needed

export async function POST(request) {
  const { email } = await request.json();
  try {
    await generateResetToken(email);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}