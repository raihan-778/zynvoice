// models/AuditLog.ts
import { IAuditLog } from "@/types/database";
import { Schema, model, models } from "mongoose";

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

const AuditLog =
  models?.AuditLog || model<IAuditLog>("AuditLog", AuditLogSchema);
export default AuditLog;
