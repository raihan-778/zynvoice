import mongoose, { Document, Schema } from "mongoose";

export interface ICompanyInfo extends Document {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  logo?: string; // Base64 or URL
  website?: string;
  taxId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanyInfoSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Company email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Company phone is required"],
      trim: true,
    },
    address: {
      street: {
        type: String,
        required: [true, "Street address is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
      },
      zipCode: {
        type: String,
        required: [true, "Zip code is required"],
        trim: true,
      },
      country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
        default: "United States",
      },
    },
    logo: {
      type: String,
      default: null,
    },
    website: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, "Please enter a valid website URL"],
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

export default mongoose.models.CompanyInfo ||
  mongoose.model<ICompanyInfo>("CompanyInfo", CompanyInfoSchema);
