// import mongoose, { Document, Schema } from "mongoose";
// import { ICompanyInfo } from "./CompanyInfo";
// import { IClient } from "./Client";
// import { IServiceItem } from "./ServiceItem";
// import { IInvoiceTemplate } from "./InvoiceTemplet";

// export interface IInvoice extends Document {
//   invoiceNumber: string;
//   companyInfo: ICompanyInfo["_id"];
//   client: IClient["_id"];
//   serviceItems: IServiceItem[];
//   template: IInvoiceTemplate["_id"];
//   subtotal: number;
//   taxRate: number;
//   taxAmount: number;
//   discountRate: number;
//   discountAmount: number;
//   totalAmount: number;
//   currency: string;
//   status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
//   issueDate: Date;
//   dueDate: Date;
//   notes?: string;
//   terms?: string;
//   paymentMethod?: string;
//   emailSent: boolean;
//   emailSentAt?: Date;
//   paidAt?: Date;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const InvoiceSchema: Schema = new Schema(
//   {
//     invoiceNumber: {
//       type: String,
//       required: [true, "Invoice number is required"],
//       unique: true,
//       trim: true,
//       maxlength: [20, "Invoice number cannot exceed 20 characters"],
//     },
//     companyInfo: {
//       type: Schema.Types.ObjectId,
//       ref: "CompanyInfo",
//       required: [true, "Company information is required"],
//     },
//     client: {
//       type: Schema.Types.ObjectId,
//       ref: "Client",
//       required: [true, "Client information is required"],
//     },
//     serviceItems: [
//       {
//         description: {
//           type: String,
//           required: [true, "Service description is required"],
//           trim: true,
//           maxlength: [500, "Description cannot exceed 500 characters"],
//         },
//         quantity: {
//           type: Number,
//           required: [true, "Quantity is required"],
//           min: [0.01, "Quantity must be greater than 0"],
//           max: [10000, "Quantity cannot exceed 10,000"],
//         },
//         unitPrice: {
//           type: Number,
//           required: [true, "Unit price is required"],
//           min: [0, "Unit price cannot be negative"],
//           max: [1000000, "Unit price cannot exceed 1,000,000"],
//         },
//         amount: {
//           type: Number,
//           required: [true, "Amount is required"],
//           min: [0, "Amount cannot be negative"],
//         },
//         category: {
//           type: String,
//           trim: true,
//           enum: ["Design", "Development", "Consultation", "Marketing", "Other"],
//           default: "Other",
//         },
//       },
//     ],
//     template: {
//       type: Schema.Types.ObjectId,
//       ref: "InvoiceTemplate",
//       required: [true, "Invoice template is required"],
//     },
//     subtotal: {
//       type: Number,
//       required: [true, "Subtotal is required"],
//       min: [0, "Subtotal cannot be negative"],
//     },
//     taxRate: {
//       type: Number,
//       default: 0,
//       min: [0, "Tax rate cannot be negative"],
//       max: [100, "Tax rate cannot exceed 100%"],
//     },
//     taxAmount: {
//       type: Number,
//       default: 0,
//       min: [0, "Tax amount cannot be negative"],
//     },
//     discountRate: {
//       type: Number,
//       default: 0,
//       min: [0, "Discount rate cannot be negative"],
//       max: [100, "Discount rate cannot exceed 100%"],
//     },
//     discountAmount: {
//       type: Number,
//       default: 0,
//       min: [0, "Discount amount cannot be negative"],
//     },
//     totalAmount: {
//       type: Number,
//       required: [true, "Total amount is required"],
//       min: [0, "Total amount cannot be negative"],
//     },
//     currency: {
//       type: String,
//       required: [true, "Currency is required"],
//       enum: ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CNY", "INR"],
//       default: "USD",
//     },
//     status: {
//       type: String,
//       required: [true, "Invoice status is required"],
//       enum: ["draft", "sent", "paid", "overdue", "cancelled"],
//       default: "draft",
//     },
//     issueDate: {
//       type: Date,
//       required: [true, "Issue date is required"],
//       default: Date.now,
//     },
//     dueDate: {
//       type: Date,
//       required: [true, "Due date is required"],
//     },
//     notes: {
//       type: String,
//       trim: true,
//       maxlength: [1000, "Notes cannot exceed 1000 characters"],
//     },
//     terms: {
//       type: String,
//       trim: true,
//       maxlength: [1000, "Terms cannot exceed 1000 characters"],
//     },
//     paymentMethod: {
//       type: String,
//       trim: true,
//       enum: [
//         "Bank Transfer",
//         "Credit Card",
//         "PayPal",
//         "Check",
//         "Cash",
//         "Other",
//       ],
//       default: "Bank Transfer",
//     },
//     emailSent: {
//       type: Boolean,
//       default: false,
//     },
//     emailSentAt: {
//       type: Date,
//     },
//     paidAt: {
//       type: Date,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Generate invoice number automatically
// InvoiceSchema.pre("save", async function (next) {
//   if (!this.invoiceNumber) {
//     const year = new Date().getFullYear();
//     const month = String(new Date().getMonth() + 1).padStart(2, "0");
//     const count = await mongoose.model("Invoice").countDocuments({
//       createdAt: {
//         $gte: new Date(year, new Date().getMonth(), 1),
//         $lt: new Date(year, new Date().getMonth() + 1, 1),
//       },
//     });
//     this.invoiceNumber = `INV-${year}${month}-${String(count + 1).padStart(
//       4,
//       "0"
//     )}`;
//   }
//   next();
// });

// // Calculate due date (30 days from issue date by default)
// InvoiceSchema.pre("save", function (this: IInvoice, next) {
//   if (!this.dueDate) {
//     this.dueDate = new Date(
//       this.issueDate.getTime() + 30 * 24 * 60 * 60 * 1000
//     );
//   }
//   next();
// });

// // Calculate totals
// InvoiceSchema.pre("save", function (this: any, next) {
//   // Calculate subtotal
//   this.subtotal = this.serviceItems.reduce(
//     (sum: number, item: any) => sum + item.amount,
//     0
//   );

//   // Calculate discount amount
//   this.discountAmount = (this.subtotal * this.discountRate) / 100;

//   // Calculate tax amount (after discount)
//   const taxableAmount = this.subtotal - this.discountAmount;
//   this.taxAmount = (taxableAmount * this.taxRate) / 100;

//   // Calculate total amount
//   this.totalAmount = this.subtotal - this.discountAmount + this.taxAmount;

//   next();
// });

// export default mongoose.models.Invoice ||
//   mongoose.model<IInvoice>("Invoice", InvoiceSchema);

// ## Step 7: Main Invoice Schema

// 📁 src/models/Invoice.ts
import mongoose, { Document, Schema } from "mongoose";
import { IServiceItem } from "./ServiceItem";
import { IClient } from "./Client";
import { ICompanyInfo } from "./CompanyInfo";

export interface IInvoice extends Document {
  _id: string;
  invoiceNumber: string;
  client: mongoose.Types.ObjectId;
  companyInfo: mongoose.Types.ObjectId;
  template: mongoose.Types.ObjectId;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  items: IServiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountAmount: number;
  total: number;
  currency: string;
  dates: {
    issued: Date;
    due: Date;
    paid?: Date;
  };
  notes?: string;
  terms?: string;
  paymentInstructions?: string;
  customFields?: Record<string, any>;
  emailSent: boolean;
  emailSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: {
      type: String,
      required: [true, "Invoice number is required"],
      unique: true,
      trim: true,
      maxlength: [20, "Invoice number cannot exceed 20 characters"],
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Client is required"],
    },
    companyInfo: {
      type: Schema.Types.ObjectId,
      ref: "CompanyInfo",
      required: [true, "Company info is required"],
    },
    template: {
      type: Schema.Types.ObjectId,
      ref: "InvoiceTemplate",
      required: [true, "Template is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["draft", "sent", "paid", "overdue", "cancelled"],
        message: "Status must be one of: draft, sent, paid, overdue, cancelled",
      },
      default: "draft",
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "ServiceItem",
        required: true,
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: [0, "Subtotal cannot be negative"],
      default: 0,
    },
    taxRate: {
      type: Number,
      min: [0, "Tax rate cannot be negative"],
      max: [100, "Tax rate cannot exceed 100%"],
      default: 0,
    },
    taxAmount: {
      type: Number,
      min: [0, "Tax amount cannot be negative"],
      default: 0,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },
    discountValue: {
      type: Number,
      min: [0, "Discount value cannot be negative"],
      default: 0,
      validate: {
        validator: function (this: IInvoice, value: number) {
          if (this.discountType === "percentage") {
            return value <= 100;
          }
          return true;
        },
        message: "Percentage discount cannot exceed 100%",
      },
    },
    discountAmount: {
      type: Number,
      min: [0, "Discount amount cannot be negative"],
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      min: [0, "Total cannot be negative"],
      default: 0,
    },
    currency: {
      type: String,
      required: true,
      enum: {
        values: ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "INR"],
        message: "Currency must be one of: USD, EUR, GBP, CAD, AUD, JPY, INR",
      },
      default: "USD",
    },
    dates: {
      issued: {
        type: Date,
        required: [true, "Issue date is required"],
        default: Date.now,
      },
      due: {
        type: Date,
        required: [true, "Due date is required"],
        validate: {
          validator: function (this: IInvoice, value: Date) {
            return value >= this.dates.issued;
          },
          message: "Due date cannot be before issue date",
        },
      },
      paid: Date,
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
      default: "Payment is due within 30 days of invoice date.",
    },
    paymentInstructions: {
      type: String,
      trim: true,
      maxlength: [500, "Payment instructions cannot exceed 500 characters"],
    },
    customFields: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailSentAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
InvoiceSchema.index({ invoiceNumber: 1 }, { unique: true });
InvoiceSchema.index({ client: 1 });
InvoiceSchema.index({ status: 1 });
InvoiceSchema.index({ "dates.issued": -1 });
InvoiceSchema.index({ "dates.due": 1 });
InvoiceSchema.index({ companyInfo: 1 });

// Virtual for checking if invoice is overdue
InvoiceSchema.virtual("isOverdue").get(function (this: IInvoice) {
  return this.status !== "paid" && this.dates.due < new Date();
});

// Auto-generate invoice number
InvoiceSchema.pre("save", async function (this: IInvoice) {
  if (this.isNew && !this.invoiceNumber) {
    const count = await mongoose.model("Invoice").countDocuments();
    const year = new Date().getFullYear();
    this.invoiceNumber = `INV-${year}-${String(count + 1).padStart(4, "0")}`;
  }
});

// Calculate totals before saving
InvoiceSchema.pre("save", function (this: IInvoice) {
  // Calculate discount amount
  if (this.discountType === "percentage") {
    this.discountAmount = (this.subtotal * this.discountValue) / 100;
  } else {
    this.discountAmount = this.discountValue;
  }

  // Calculate tax amount
  const afterDiscount = this.subtotal - this.discountAmount;
  this.taxAmount = (afterDiscount * this.taxRate) / 100;

  // Calculate total
  this.total = afterDiscount + this.taxAmount;
});

export default mongoose.models.Invoice ||
  mongoose.model<IInvoice>("Invoice", InvoiceSchema);
