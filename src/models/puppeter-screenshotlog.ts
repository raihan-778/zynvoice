import mongoose, { Schema, Document } from "mongoose";

export interface IScreenshotLog extends Document {
  url: string;
  timestamp: Date;
}

const ScreenshotLogSchema = new Schema<IScreenshotLog>({
  url: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.ScreenshotLog ||
  mongoose.model<IScreenshotLog>("ScreenshotLog", ScreenshotLogSchema);
