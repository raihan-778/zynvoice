// import mongoose, { Document, Schema } from "mongoose";

// export interface IClient extends Document {
//   name: string;
//   email: string;
//   phone?: string;
//   address: {
//     street: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     country: string;
//   };
//   companyName?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const ClientSchema: Schema = new Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Client name is required"],
//       trim: true,
//       maxlength: [100, "Client name cannot exceed 100 characters"],
//     },
//     email: {
//       type: String,
//       required: [true, "Client email is required"],
//       trim: true,
//       lowercase: true,
//       match: [
//         /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//         "Please enter a valid email",
//       ],
//     },
//     phone: {
//       type: String,
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
//     companyName: {
//       type: String,
//       trim: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.models.Client ||
//   mongoose.model<IClient>("Client", ClientSchema);

// 📁 src/models/Client.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IClient extends Document {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      maxlength: [100, "Client name cannot exceed 100 characters"],
    },
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
      trim: true,
      validate: {
        validator: function (v: string) {
          return !v || /^[\+]?[1-9][\d]{0,15}$/.test(v.replace(/\s/g, ""));
        },
        message: "Please enter a valid phone number",
      },
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
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
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
ClientSchema.index({ email: 1 }, { unique: true });
ClientSchema.index({ name: 1 });
ClientSchema.index({ company: 1 });

export default mongoose.models.Client ||
  mongoose.model<IClient>("Client", ClientSchema);
