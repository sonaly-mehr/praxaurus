import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the User schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String },
  plan: { type: String, enum: ['free', 'premium'], default: 'free' },
  customerId: { type: String, unique: true },
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  role: { type: String, enum: ['user', 'admin'], default: 'user' } // Added role field
});

// Password hashing before saving user
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Check if the model already exists before creating it
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;