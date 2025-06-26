import mongoose, { Document, Schema } from "mongoose";

export interface IInvoiceTemplate extends Document {
  name: string;
  description?: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  layout: "modern" | "classic" | "minimal" | "corporate";
  fontFamily: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceTemplateSchema: Schema = new Schema(
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
    colorScheme: {
      primary: {
        type: String,
        required: [true, "Primary color is required"],
        match: [/^#[0-9A-F]{6}$/i, "Please enter a valid hex color"],
      },
      secondary: {
        type: String,
        required: [true, "Secondary color is required"],
        match: [/^#[0-9A-F]{6}$/i, "Please enter a valid hex color"],
      },
      accent: {
        type: String,
        required: [true, "Accent color is required"],
        match: [/^#[0-9A-F]{6}$/i, "Please enter a valid hex color"],
      },
      text: {
        type: String,
        required: [true, "Text color is required"],
        match: [/^#[0-9A-F]{6}$/i, "Please enter a valid hex color"],
      },
      background: {
        type: String,
        required: [true, "Background color is required"],
        match: [/^#[0-9A-F]{6}$/i, "Please enter a valid hex color"],
      },
    },
    layout: {
      type: String,
      required: [true, "Layout is required"],
      enum: ["modern", "classic", "minimal", "corporate"],
      default: "modern",
    },
    fontFamily: {
      type: String,
      required: [true, "Font family is required"],
      enum: ["Inter", "Roboto", "Open Sans", "Lato", "Montserrat"],
      default: "Inter",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.InvoiceTemplate ||
  mongoose.model<IInvoiceTemplate>("InvoiceTemplate", InvoiceTemplateSchema);
