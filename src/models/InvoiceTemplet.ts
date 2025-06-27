// import mongoose, { Document, Schema } from "mongoose";

// export interface IInvoiceTemplate extends Document {
//   name: string;
//   description?: string;
//   colorScheme: {
//     primary: string;
//     secondary: string;
//     accent: string;
//     text: string;
//     background: string;
//   };
//   layout: "modern" | "classic" | "minimal" | "corporate";
//   fontFamily: string;
//   isActive: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const InvoiceTemplateSchema: Schema = new Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Template name is required"],
//       trim: true,
//       unique: true,
//       maxlength: [50, "Template name cannot exceed 50 characters"],
//     },
//     description: {
//       type: String,
//       trim: true,
//       maxlength: [200, "Description cannot exceed 200 characters"],
//     },
//     colorScheme: {
//       primary: {
//         type: String,
//         required: [true, "Primary color is required"],
//         match: [/^#[0-9A-F]{6}$/i, "Please enter a valid hex color"],
//       },
//       secondary: {
//         type: String,
//         required: [true, "Secondary color is required"],
//         match: [/^#[0-9A-F]{6}$/i, "Please enter a valid hex color"],
//       },
//       accent: {
//         type: String,
//         required: [true, "Accent color is required"],
//         match: [/^#[0-9A-F]{6}$/i, "Please enter a valid hex color"],
//       },
//       text: {
//         type: String,
//         required: [true, "Text color is required"],
//         match: [/^#[0-9A-F]{6}$/i, "Please enter a valid hex color"],
//       },
//       background: {
//         type: String,
//         required: [true, "Background color is required"],
//         match: [/^#[0-9A-F]{6}$/i, "Please enter a valid hex color"],
//       },
//     },
//     layout: {
//       type: String,
//       required: [true, "Layout is required"],
//       enum: ["modern", "classic", "minimal", "corporate"],
//       default: "modern",
//     },
//     fontFamily: {
//       type: String,
//       required: [true, "Font family is required"],
//       enum: ["Inter", "Roboto", "Open Sans", "Lato", "Montserrat"],
//       default: "Inter",
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.models.InvoiceTemplate ||
//   mongoose.model<IInvoiceTemplate>("InvoiceTemplate", InvoiceTemplateSchema);

// 📁 src/models/InvoiceTemplate.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IInvoiceTemplate extends Document {
  _id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  layout: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
      background: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
    spacing: {
      margin: number;
      padding: number;
    };
  };
  sections: {
    showLogo: boolean;
    showBankDetails: boolean;
    showNotes: boolean;
    showTerms: boolean;
    showSignature: boolean;
  };
  customFields?: Array<{
    name: string;
    type: "text" | "number" | "date" | "select";
    required: boolean;
    options?: string[];
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceTemplateSchema = new Schema<IInvoiceTemplate>(
  {
    name: {
      type: String,
      required: [true, "Template name is required"],
      trim: true,
      unique: true,
      maxlength: [50, "Template name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    layout: {
      colors: {
        primary: {
          type: String,
          default: "#2563eb",
          validate: {
            validator: function (v: string) {
              return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
            },
            message: "Primary color must be a valid hex color",
          },
        },
        secondary: {
          type: String,
          default: "#64748b",
          validate: {
            validator: function (v: string) {
              return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
            },
            message: "Secondary color must be a valid hex color",
          },
        },
        accent: {
          type: String,
          default: "#f59e0b",
          validate: {
            validator: function (v: string) {
              return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
            },
            message: "Accent color must be a valid hex color",
          },
        },
        text: {
          type: String,
          default: "#1f2937",
          validate: {
            validator: function (v: string) {
              return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
            },
            message: "Text color must be a valid hex color",
          },
        },
        background: {
          type: String,
          default: "#ffffff",
          validate: {
            validator: function (v: string) {
              return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
            },
            message: "Background color must be a valid hex color",
          },
        },
      },
      fonts: {
        heading: {
          type: String,
          default: "Inter",
          enum: ["Inter", "Roboto", "Open Sans", "Lato", "Poppins"],
        },
        body: {
          type: String,
          default: "Inter",
          enum: ["Inter", "Roboto", "Open Sans", "Lato", "Poppins"],
        },
      },
      spacing: {
        margin: { type: Number, default: 20, min: 10, max: 50 },
        padding: { type: Number, default: 15, min: 5, max: 30 },
      },
    },
    sections: {
      showLogo: { type: Boolean, default: true },
      showBankDetails: { type: Boolean, default: true },
      showNotes: { type: Boolean, default: true },
      showTerms: { type: Boolean, default: true },
      showSignature: { type: Boolean, default: false },
    },
    customFields: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
          maxlength: [50, "Field name cannot exceed 50 characters"],
        },
        type: {
          type: String,
          required: true,
          enum: ["text", "number", "date", "select"],
        },
        required: { type: Boolean, default: false },
        options: [{ type: String, trim: true }],
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Ensure only one default template
InvoiceTemplateSchema.pre("save", async function (this: IInvoiceTemplate) {
  if (this.isDefault) {
    await mongoose
      .model("InvoiceTemplate")
      .updateMany({ _id: { $ne: this._id } }, { isDefault: false });
  }
});

// Indexes
InvoiceTemplateSchema.index({ name: 1 }, { unique: true });
InvoiceTemplateSchema.index({ isDefault: 1 });

export default mongoose.models.InvoiceTemplate ||
  mongoose.model<IInvoiceTemplate>("InvoiceTemplate", InvoiceTemplateSchema);
