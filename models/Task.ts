import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  category: 'academic' | 'personal' | 'work' | 'other';
  dueDate: Date;
  estimatedTime: number; // in minutes
  actualTimeSpent: number; // in minutes
  completedAt?: Date;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema<ITask> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'overdue'],
      default: 'pending',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
      index: true,
    },
    category: {
      type: String,
      enum: ['academic', 'personal', 'work', 'other'],
      default: 'other',
      index: true,
    },
    dueDate: { type: Date, required: true, index: true },
    estimatedTime: { type: Number, default: 30 },
    actualTimeSpent: { type: Number, default: 0 },
    completedAt: { type: Date },
    isArchived: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

// Compiling model or using existing one to avoid Next.js Hot Reload duplicate compile error
export const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
