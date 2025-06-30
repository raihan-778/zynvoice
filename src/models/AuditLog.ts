// models/AuditLog.ts
import mongoose, { Model, Schema } from "mongoose";
import {
  IAuditLog,
  IClient,
  ICompany,
  IInvoice,
  ITemplate,
  IUser,
} from "@/types/database";

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["create", "update", "delete", "view", "send", "pay"],
      required: true,
    },
    resourceType: {
      type: String,
      enum: ["invoice", "client", "company", "template", "user"],
      required: true,
    },
    resourceId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    details: {
      changes: {
        type: Schema.Types.Mixed,
        default: {},
      },
      metadata: {
        type: Schema.Types.Mixed,
        default: {},
      },
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ resourceType: 1, resourceId: 1 });
AuditLogSchema.index({ action: 1 });

// Export models
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
const Company: Model<ICompany> =
  mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);
const Client: Model<IClient> =
  mongoose.models.Client || mongoose.model<IClient>("Client", ClientSchema);
const Invoice: Model<IInvoice> =
  mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
const Template: Model<ITemplate> =
  mongoose.models.Template ||
  mongoose.model<ITemplate>("Template", TemplateSchema);
const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

export { User, Company, Client, Invoice, Template, AuditLog };
export { connectDB };
