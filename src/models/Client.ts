// models/Client.ts
import { ClientInfo } from "@/lib/validations/validation";

import { Schema, model, models } from "mongoose";

export const ClientSchema = new Schema<ClientInfo>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      maxlength: [100, "Client name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Client email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      country: { type: String, trim: true },
    },

    paymentTerms: {
      type: Number,
      default: 30,
      min: [1, "Payment terms must be at least 1 day"],
      max: [365, "Payment terms cannot exceed 365 days"],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
ClientSchema.index({ userId: 1 });
ClientSchema.index({ userId: 1, email: 1 }, { unique: true });
ClientSchema.index({ userId: 1, status: 1 });
ClientSchema.index({ userId: 1, tags: 1 });

// // Virtual for outstanding balance
// ClientSchema.virtual("outstandingBalance").get(function () {
//   return this.totalInvoiced - this.totalPaid;
// });

// Export the model (handles both development and production environments)
const ClientModel = models?.Client || model<ClientInfo>("Client", ClientSchema);
export default ClientModel;
