/ lib/delmos / ServiceItem.ts;
import mongoose, { Document, Schema } from "mongoose";

export interface IServiceItem extends Document {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  category?: string;
}

const ServiceItemSchema: Schema = new Schema({
  description: {
    type: String,
    required: [true, "Service description is required"],
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [0.01, "Quantity must be greater than 0"],
    max: [10000, "Quantity cannot exceed 10,000"],
  },
  unitPrice: {
    type: Number,
    required: [true, "Unit price is required"],
    min: [0, "Unit price cannot be negative"],
    max: [1000000, "Unit price cannot exceed 1,000,000"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0, "Amount cannot be negative"],
  },
  category: {
    type: String,
    trim: true,
    enum: ["Design", "Development", "Consultation", "Marketing", "Other"],
    default: "Other",
  },
});

export default mongoose.models.ServiceItem ||
  mongoose.model<IServiceItem>("ServiceItem", ServiceItemSchema);
