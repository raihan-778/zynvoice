// ============================================================================
// models/User.ts - Updated User Model for Auth
// ============================================================================

import bcrypt from "bcryptjs";
import mongoose, { Schema, model, models } from "mongoose";

export interface ISubscription {
  plan: "free" | "pro" | "enterprise";
  status: "active" | "canceled" | "trialing";
  currentPeriodEnd?: Date;
}

const SubscriptionSchema: Schema = new Schema({
  plan: {
    type: String,
    enum: ["free", "pro", "enterprise"], // Only 3 allowed plan types
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "canceled", "trialing"], // Only 3 allowed status types
    required: true,
  },
  currentPeriodEnd: {
    type: Date,
    default: null,
  },
});
export interface IUser {
  _id: mongoose.Types.ObjectId;
  id?: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  provider?: "credentials" | "google";
  isVerified: boolean;
  role?: "user" | "admin";
  subscription: ISubscription;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      select: false, // Don't include in queries by default
      minlength: [6, "Password must be at least 6 characters"],
    },
    image: {
      type: String,
      default: null,
    },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    subscription: {
      type: SubscriptionSchema,
      required: true,
      default: {
        plan: "free",
        status: "trialing",
      },
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ resetPasswordToken: 1 });
UserSchema.index({ emailVerificationToken: 1 });

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = models?.User || model<IUser>("User", UserSchema);
export default UserModel;
