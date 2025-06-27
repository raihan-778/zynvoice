// import mongoose, { Document, Schema } from "mongoose";

// export interface IServiceItem extends Document {
//   description: string;
//   quantity: number;
//   unitPrice: number;
//   amount: number;
//   category?: string;
// }

// const ServiceItemSchema: Schema = new Schema({
//   description: {
//     type: String,
//     required: [true, "Service description is required"],
//     trim: true,
//     maxlength: [500, "Description cannot exceed 500 characters"],
//   },
//   quantity: {
//     type: Number,
//     required: [true, "Quantity is required"],
//     min: [0.01, "Quantity must be greater than 0"],
//     max: [10000, "Quantity cannot exceed 10,000"],
//   },
//   unitPrice: {
//     type: Number,
//     required: [true, "Unit price is required"],
//     min: [0, "Unit price cannot be negative"],
//     max: [1000000, "Unit price cannot exceed 1,000,000"],
//   },
//   amount: {
//     type: Number,
//     required: [true, "Amount is required"],
//     min: [0, "Amount cannot be negative"],
//   },
//   category: {
//     type: String,
//     trim: true,
//     enum: ["Design", "Development", "Consultation", "Marketing", "Other"],
//     default: "Other",
//   },
// });

// export default mongoose.models.ServiceItem ||
//   mongoose.model<IServiceItem>("ServiceItem", ServiceItemSchema);

// 📁 src/models/ServiceItem.ts

import mongoose, { Document, Schema } from "mongoose";

export interface IServiceItem extends Document {
  _id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  category?: string;
  unit?: string;
  taxable?: boolean;
  taxRate?: number;
}

const ServiceItemSchema = new Schema<IServiceItem>(
  {
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
      validate: {
        validator: function (v: number) {
          return v > 0;
        },
        message: "Quantity must be a positive number",
      },
    },
    rate: {
      type: Number,
      required: [true, "Rate is required"],
      min: [0, "Rate cannot be negative"],
      validate: {
        validator: function (v: number) {
          return v >= 0;
        },
        message: "Rate must be a non-negative number",
      },
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },
    category: {
      type: String,
      trim: true,
      enum: {
        values: ["Design", "Development", "Consulting", "Marketing", "Other"],
        message:
          "Category must be one of: Design, Development, Consulting, Marketing, Other",
      },
      default: "Other",
    },
    unit: {
      type: String,
      trim: true,
      enum: {
        values: ["hour", "day", "week", "month", "project", "piece"],
        message: "Unit must be one of: hour, day, week, month, project, piece",
      },
      default: "hour",
    },
    taxable: {
      type: Boolean,
      default: true,
    },
    taxRate: {
      type: Number,
      min: [0, "Tax rate cannot be negative"],
      max: [100, "Tax rate cannot exceed 100%"],
      default: 0,
    },
  },
  {
    timestamps: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for calculating amount based on quantity and rate
ServiceItemSchema.pre("save", function (this: IServiceItem) {
  this.amount = this.quantity * this.rate;
});

export default mongoose.models.ServiceItem ||
  mongoose.model<IServiceItem>("ServiceItem", ServiceItemSchema);
