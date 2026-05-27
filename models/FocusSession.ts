import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFocusSession extends Document {
  taskId?: mongoose.Types.ObjectId;
  duration: number; // in seconds
  completed: boolean;
  timestamp: Date;
}

const FocusSessionSchema: Schema<IFocusSession> = new Schema(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', index: true },
    duration: { type: Number, required: true },
    completed: { type: Boolean, default: true },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: false,
  }
);

export const FocusSession: Model<IFocusSession> =
  mongoose.models.FocusSession || mongoose.model<IFocusSession>('FocusSession', FocusSessionSchema);
