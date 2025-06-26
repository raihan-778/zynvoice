import mongoose, { Document, Schema } from "mongoose";
import { ICompanyInfo } from "./CompanyInfo";
import { IClient } from "./Client";
import { IServiceItem } from "./ServiceItem";
import { IInvoiceTemplate } from "./InvoiceTemplet";

export interface IInvoice extends Document {
  invoiceNumber: string;
  companyInfo: ICompanyInfo["_id"];
  client: IClient["_id"];
  serviceItems: IServiceItem[];
  template: IInvoiceTemplate["_id"];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  issueDate: Date;
  dueDate: Date;
  notes?: string;
  terms?: string;
  paymentMethod?: string;
  emailSent: boolean;
  emailSentAt?: Date;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema: Schema = new Schema(
  {
    invoiceNumber: {
      type: String,
      required: [true, "Invoice number is required"],
      unique: true,
      trim: true,
      maxlength: [20, "Invoice number cannot exceed 20 characters"],
    },
    companyInfo: {
      type: Schema.Types.ObjectId,
      ref: "CompanyInfo",
      required: [true, "Company information is required"],
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Client information is required"],
    },
    serviceItems: [
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
          max: [10000, "Quantity cannot exceed 10,000"],
        },
        unitPrice: {
          type: Number,
          required: [true, "Unit price is required"],
          min: [0, "Unit price cannot be negative"],
          max: [1000000, "Unit price cannot exceed 1,000,000"],
        },
        amount: {
          type: Number,
          required: [true, "Amount is required"],
          min: [0, "Amount cannot be negative"],
        },
        category: {
          type: String,
          trim: true,
          enum: ["Design", "Development", "Consultation", "Marketing", "Other"],
          default: "Other",
        },
      },
    ],
    template: {
      type: Schema.Types.ObjectId,
      ref: "InvoiceTemplate",
      required: [true, "Invoice template is required"],
    },
    subtotal: {
      type: Number,
      required: [true, "Subtotal is required"],
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
      default: 0,
      min: [0, "Tax amount cannot be negative"],
    },
    discountRate: {
      type: Number,
      default: 0,
      min: [0, "Discount rate cannot be negative"],
      max: [100, "Discount rate cannot exceed 100%"],
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: [0, "Discount amount cannot be negative"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      enum: ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CNY", "INR"],
      default: "USD",
    },
    status: {
      type: String,
      required: [true, "Invoice status is required"],
      enum: ["draft", "sent", "paid", "overdue", "cancelled"],
      default: "draft",
    },
    issueDate: {
      type: Date,
      required: [true, "Issue date is required"],
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    terms: {
      type: String,
      trim: true,
      maxlength: [1000, "Terms cannot exceed 1000 characters"],
    },
    paymentMethod: {
      type: String,
      trim: true,
      enum: [
        "Bank Transfer",
        "Credit Card",
        "PayPal",
        "Check",
        "Cash",
        "Other",
      ],
      default: "Bank Transfer",
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailSentAt: {
      type: Date,
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Generate invoice number automatically
InvoiceSchema.pre("save", async function (next) {
  if (!this.invoiceNumber) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const count = await mongoose.model("Invoice").countDocuments({
      createdAt: {
        $gte: new Date(year, new Date().getMonth(), 1),
        $lt: new Date(year, new Date().getMonth() + 1, 1),
      },
    });
    this.invoiceNumber = `INV-${year}${month}-${String(count + 1).padStart(
      4,
      "0"
    )}`;
  }
  next();
});

// Calculate due date (30 days from issue date by default)
InvoiceSchema.pre("save", function (this: IInvoice, next) {
  if (!this.dueDate) {
    this.dueDate = new Date(
      this.issueDate.getTime() + 30 * 24 * 60 * 60 * 1000
    );
  }
  next();
});

// Calculate totals
InvoiceSchema.pre("save", function (this: any, next) {
  // Calculate subtotal
  this.subtotal = this.serviceItems.reduce(
    (sum: number, item: any) => sum + item.amount,
    0
  );

  // Calculate discount amount
  this.discountAmount = (this.subtotal * this.discountRate) / 100;

  // Calculate tax amount (after discount)
  const taxableAmount = this.subtotal - this.discountAmount;
  this.taxAmount = (taxableAmount * this.taxRate) / 100;

  // Calculate total amount
  this.totalAmount = this.subtotal - this.discountAmount + this.taxAmount;

  next();
});

export default mongoose.models.Invoice ||
  mongoose.model<IInvoice>("Invoice", InvoiceSchema);
