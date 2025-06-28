// models/CompanyInfo.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICompanyInfo extends Document {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  logo?: string;
  website?: string;
  taxId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanyInfoSchema = new Schema<ICompanyInfo>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    taxId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one company info document exists
CompanyInfoSchema.index({}, { unique: true });

export const CompanyInfo =
  mongoose.models.CompanyInfo ||
  mongoose.model<ICompanyInfo>("CompanyInfo", CompanyInfoSchema);
