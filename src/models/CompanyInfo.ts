// import mongoose, { Document, Schema } from "mongoose";

// export interface ICompanyInfo extends Document {
//   name: string;
//   email: string;
//   phone: string;
//   address: {
//     street: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     country: string;
//   };
//   logo?: string; // Base64 or URL
//   website?: string;
//   taxId?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const CompanyInfoSchema: Schema = new Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Company name is required"],
//       trim: true,
//       maxlength: [100, "Company name cannot exceed 100 characters"],
//     },
//     email: {
//       type: String,
//       required: [true, "Company email is required"],
//       trim: true,
//       lowercase: true,
//       match: [
//         /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//         "Please enter a valid email",
//       ],
//     },
//     phone: {
//       type: String,
//       required: [true, "Company phone is required"],
//       trim: true,
//     },
//     address: {
//       street: {
//         type: String,
//         required: [true, "Street address is required"],
//         trim: true,
//       },
//       city: {
//         type: String,
//         required: [true, "City is required"],
//         trim: true,
//       },
//       state: {
//         type: String,
//         required: [true, "State is required"],
//         trim: true,
//       },
//       zipCode: {
//         type: String,
//         required: [true, "Zip code is required"],
//         trim: true,
//       },
//       country: {
//         type: String,
//         required: [true, "Country is required"],
//         trim: true,
//         default: "United States",
//       },
//     },
//     logo: {
//       type: String,
//       default: null,
//     },
//     website: {
//       type: String,
//       trim: true,
//       match: [/^https?:\/\/.+/, "Please enter a valid website URL"],
//     },
//     taxId: {
//       type: String,
//       trim: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.models.CompanyInfo ||
//   mongoose.model<ICompanyInfo>("CompanyInfo", CompanyInfoSchema);
// 📁 src/models/CompanyInfo.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ICompanyInfo extends Document {
  _id: string;
  name: string;
  logo?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    accountHolderName: string;
  };
  taxInfo?: {
    taxId: string;
    vatNumber?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CompanyInfoSchema = new Schema<ICompanyInfo>(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    logo: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|svg)$/i.test(v);
        },
        message: "Logo must be a valid image URL",
      },
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
    contact: {
      email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        validate: {
          validator: function (v: string) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
          },
          message: "Please enter a valid email address",
        },
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
      },
      website: {
        type: String,
        trim: true,
        validate: {
          validator: function (v: string) {
            return !v || /^https?:\/\/.+\..+/.test(v);
          },
          message: "Please enter a valid website URL",
        },
      },
    },
    bankDetails: {
      bankName: { type: String, trim: true },
      accountNumber: { type: String, trim: true },
      routingNumber: { type: String, trim: true },
      accountHolderName: { type: String, trim: true },
    },
    taxInfo: {
      taxId: { type: String, trim: true },
      vatNumber: { type: String, trim: true },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
CompanyInfoSchema.index({ name: 1 });
CompanyInfoSchema.index({ "contact.email": 1 });

export default mongoose.models.CompanyInfo ||
  mongoose.model<ICompanyInfo>("CompanyInfo", CompanyInfoSchema);
