// models/Template.ts
import mongoose, { Schema } from "mongoose";
import { ITemplate } from "@/types/database";

const TemplateSchema = new Schema<ITemplate>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Template name is required"],
      trim: true,
      maxlength: [100, "Template name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    design: {
      layout: {
        type: String,
        enum: ["modern", "classic", "minimal"],
        default: "modern",
      },
      primaryColor: {
        type: String,
        default: "#2563eb",
        match: [
          /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
          "Please enter a valid hex color",
        ],
      },
      secondaryColor: {
        type: String,
        default: "#64748b",
        match: [
          /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
          "Please enter a valid hex color",
        ],
      },
      fontFamily: {
        type: String,
        default: "Inter",
      },
      fontSize: {
        type: Number,
        default: 14,
        min: [8, "Font size must be at least 8"],
        max: [24, "Font size cannot exceed 24"],
      },
      logoPosition: {
        type: String,
        enum: ["left", "center", "right"],
        default: "left",
      },
      showLogo: {
        type: Boolean,
        default: true,
      },
      showCompanyAddress: {
        type: Boolean,
        default: true,
      },
      showClientAddress: {
        type: Boolean,
        default: true,
      },
      showInvoiceNumber: {
        type: Boolean,
        default: true,
      },
      showDates: {
        type: Boolean,
        default: true,
      },
      showPaymentTerms: {
        type: Boolean,
        default: true,
      },
      showNotes: {
        type: Boolean,
        default: true,
      },
      showTerms: {
        type: Boolean,
        default: true,
      },
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isPublic: {
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
TemplateSchema.index({ userId: 1 });
TemplateSchema.index({ userId: 1, isDefault: 1 });
TemplateSchema.index({ isPublic: 1 });

// Ensure only one default template per user
TemplateSchema.pre("save", async function (next) {
  if (this.isDefault && this.isModified("isDefault")) {
    await mongoose
      .model("Template")
      .updateMany(
        { userId: this.userId, _id: { $ne: this._id } },
        { isDefault: false }
      );
  }
  next();
});
