import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { connectToDatabase } from "./lib/utils";
import User from "./models/user";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const email = credentials.email;
        const password = credentials.password;

        if (!email || !password) {
          throw new Error("Please provide email and password!");
        }

        // Connect to the database
        await connectToDatabase();

        const user = await User.findOne({ email }).select("+password");

        if (!user || !user.password) {
          throw new Error("Invalid email or password!");
        }

        const isMatch = await compare(password, user.password);
        if (!isMatch) {
          throw new Error("Invalid email or password!");
        }

        return { name: user.name, email: user.email, id: user._id.toString() };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};