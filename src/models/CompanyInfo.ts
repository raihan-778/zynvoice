// models/Company.ts
import { ICompany } from "@/types/database";
import mongoose, { model, models, Schema } from "mongoose";

export const CompanySchema = new Schema<ICompany>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    logo: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: [true, "Company email is required"],
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
    website: {
      type: String,
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
      },
    },
    taxId: {
      type: String,
      trim: true,
    },
    bankDetails: {
      bankName: String,
      accountName: String,
      accountNumber: String,
      routingNumber: String,
      swift: String,
    },
    branding: {
      primaryColor: {
        type: String,
        default: "#2563eb",
      },
      secondaryColor: {
        type: String,
        default: "#64748b",
      },
      fontFamily: {
        type: String,
        default: "Inter",
      },
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
CompanySchema.index({ userId: 1 });
CompanySchema.index({ userId: 1, isDefault: 1 });

// Ensure only one default company per user
CompanySchema.pre("save", async function (next) {
  if (this.isDefault && this.isModified("isDefault")) {
    await mongoose
      .model("Company")
      .updateMany(
        { userId: this.userId, _id: { $ne: this._id } },
        { isDefault: false }
      );
  }
  next();
});
// Export the model (handles both development and production environments)
const CompanyModel =
  models?.Company || model<ICompany>("Company", CompanySchema);
export default CompanyModel;
