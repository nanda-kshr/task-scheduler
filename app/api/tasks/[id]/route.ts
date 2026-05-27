import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/config/db';
import { taskService } from '@/services/TaskService';
import { UpdateTaskSchema } from '@/validators/task.validator';
import { successResponse, errorResponse } from '@/utils/api';
import { rateLimiter } from '@/lib/rateLimit';
import { ValidationError } from '@/lib/errors';

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    rateLimiter(ip, { max: 60 });

    await connectToDatabase();
    const body = await req.json();

    const result = UpdateTaskSchema.safeParse(body);
    if (!result.success) {
      throw new ValidationError('Validation failed', result.error.issues);
    }

    const task = await taskService.updateTask(params.id, result.data);
    return successResponse(task, 'Task updated successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    rateLimiter(ip, { max: 60 });

    await connectToDatabase();
    
    // Parse durationSpent from query parameters or body if provided
    const { searchParams } = new URL(req.url);
    const actualTime = parseInt(searchParams.get('actualTimeSpent') || '0', 10);

    const task = await taskService.completeTask(params.id, actualTime);
    return successResponse(task, 'Task marked as completed');
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    rateLimiter(ip, { max: 60 });

    await connectToDatabase();
    await taskService.deleteTask(params.id);
    return successResponse(null, 'Task deleted/archived successfully');
  } catch (error) {
    return errorResponse(error);
  }
}
