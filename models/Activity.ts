import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivity extends Document {
  action: 'created' | 'completed' | 'rescheduled' | 'missed' | 'added';
  taskTitle: string;
  details?: string;
  timestamp: Date;
}

const ActivitySchema: Schema<IActivity> = new Schema(
  {
    action: {
      type: String,
      enum: ['created', 'completed', 'rescheduled', 'missed', 'added'],
      required: true,
      index: true,
    },
    taskTitle: { type: String, required: true },
    details: { type: String },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: false,
  }
);

export const Activity: Model<IActivity> =
  mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);
