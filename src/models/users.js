import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String },
  plan: { type: String, enum: ['free', 'premium'], default: 'free' },
  customerId: { type: String, unique: true, sparse: true },
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
});

UserSchema.pre("save", async function (next) {
  // Skip hashing if the password was already hashed during reset
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;