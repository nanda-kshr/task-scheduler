import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISuggestion extends Document {
  taskId: mongoose.Types.ObjectId;
  originalDate: Date;
  suggestedDate: Date;
  reason: string;
  status: 'pending' | 'applied' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const SuggestionSchema: Schema<ISuggestion> = new Schema(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
    originalDate: { type: Date, required: true },
    suggestedDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'applied', 'rejected'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Suggestion: Model<ISuggestion> =
  mongoose.models.Suggestion || mongoose.model<ISuggestion>('Suggestion', SuggestionSchema);
