import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  plan: { type: String, enum: ['free', 'premium'], required: true },
  period: { type: String, enum: ['monthly', 'yearly'], required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

SubscriptionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);

export default Subscription;