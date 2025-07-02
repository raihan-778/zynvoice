// ============================================================================

// models/Invoice.ts
import { IInvoice, IInvoiceItem } from "@/types/database";
import { model } from "mongoose";
import { models, Schema } from "mongoose";

const InvoiceItemSchema = new Schema<IInvoiceItem>(
  {
    description: {
      type: String,
      required: [true, "Item description is required"],
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0.01, "Quantity must be greater than 0"],
    },
    rate: {
      type: Number,
      required: [true, "Rate is required"],
      min: [0, "Rate cannot be negative"],
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },
    taxRate: {
      type: Number,
      default: 0,
      min: [0, "Tax rate cannot be negative"],
      max: [100, "Tax rate cannot exceed 100%"],
    },
  },
  { _id: false }
);

export const InvoiceSchema = new Schema<IInvoice>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: [true, "Invoice number is required"],
      trim: true,
      maxlength: [50, "Invoice number cannot exceed 50 characters"],
    },
    invoiceDate: {
      type: Date,
      required: [true, "Invoice date is required"],
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    items: {
      type: [InvoiceItemSchema],
      required: [true, "At least one item is required"],
      validate: {
        validator: function (items: IInvoiceItem[]) {
          return items.length > 0;
        },
        message: "Invoice must have at least one item",
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, "Subtotal cannot be negative"],
    },
    taxRate: {
      type: Number,
      default: 0,
      min: [0, "Tax rate cannot be negative"],
      max: [100, "Tax rate cannot exceed 100%"],
    },
    taxAmount: {
      type: Number,
      required: true,
      min: [0, "Tax amount cannot be negative"],
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },
    discountValue: {
      type: Number,
      default: 0,
      min: [0, "Discount value cannot be negative"],
    },
    discountAmount: {
      type: Number,
      required: true,
      min: [0, "Discount amount cannot be negative"],
    },
    total: {
      type: Number,
      required: true,
      min: [0, "Total cannot be negative"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      default: "USD",
      maxlength: [3, "Currency code cannot exceed 3 characters"],
    },
    status: {
      type: String,
      enum: ["draft", "sent", "viewed", "paid", "overdue", "cancelled"],
      default: "draft",
    },
    notes: {
      type: String,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    terms: {
      type: String,
      maxlength: [1000, "Terms cannot exceed 1000 characters"],
    },
    paymentTerms: {
      type: Number,
      required: [true, "Payment terms are required"],
      default: 30,
      min: [1, "Payment terms must be at least 1 day"],
    },
    paidAt: {
      type: Date,
      default: null,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: [0, "Paid amount cannot be negative"],
    },
    paymentMethod: {
      type: String,
      trim: true,
    },
    emailSentAt: {
      type: Date,
      default: null,
    },
    viewedAt: {
      type: Date,
      default: null,
    },
    templateId: {
      type: Schema.Types.ObjectId,
      ref: "Template",
      default: null,
    },
    recurring: {
      isRecurring: {
        type: Boolean,
        default: false,
      },
      frequency: {
        type: String,
        enum: ["weekly", "monthly", "quarterly", "yearly"],
        default: "monthly",
      },
      nextDate: {
        type: Date,
        default: null,
      },
      endDate: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
InvoiceSchema.index({ userId: 1 });
InvoiceSchema.index({ userId: 1, invoiceNumber: 1 }, { unique: true });
InvoiceSchema.index({ userId: 1, status: 1 });
InvoiceSchema.index({ userId: 1, clientId: 1 });
InvoiceSchema.index({ userId: 1, dueDate: 1 });
InvoiceSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate amounts
InvoiceSchema.pre("save", function (next) {
  // Calculate subtotal
  this.subtotal = this.items.reduce((sum, item) => sum + item.amount, 0);

  // Calculate discount amount
  if (this.discountType === "percentage") {
    this.discountAmount = (this.subtotal * this.discountValue) / 100;
  } else {
    this.discountAmount = this.discountValue;
  }

  // Calculate tax amount
  const taxableAmount = this.subtotal - this.discountAmount;
  this.taxAmount = (taxableAmount * this.taxRate) / 100;

  // Calculate total
  this.total = taxableAmount + this.taxAmount;

  next();
});

// Pre-save middleware for each item to calculate amount
InvoiceItemSchema.pre("save", function (next) {
  this.amount = this.quantity * this.rate;
  next();
});

// Virtual for days overdue
InvoiceSchema.virtual("daysOverdue").get(function () {
  if (this.status !== "overdue") return 0;
  const today = new Date();
  const diffTime = today.getTime() - this.dueDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
});

// Export the model (handles both development and production environments)
const InvoiceModel = models?.Invoice || model<IInvoice>("Invoice", InvoiceSchema);
export default InvoiceModel;
