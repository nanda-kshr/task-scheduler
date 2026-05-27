import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/config/db';
import { taskService } from '@/services/TaskService';
import { CreateTaskSchema } from '@/validators/task.validator';
import { successResponse, errorResponse } from '@/utils/api';
import { rateLimiter } from '@/lib/rateLimit';
import { ValidationError } from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    rateLimiter(ip, { max: 120 }); // standard limit

    await connectToDatabase();
    
    // Check search params for status or priority filters if any
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const filters: any = {};
    if (category) filters.category = category;

    const tasks = await taskService.getAllActiveTasks(filters);
    return successResponse(tasks, 'Tasks retrieved successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    rateLimiter(ip, { max: 60 }); // stricter write limit

    await connectToDatabase();
    const body = await req.json();

    const result = CreateTaskSchema.safeParse(body);
    if (!result.success) {
      throw new ValidationError('Validation failed', result.error.issues);
    }

    const task = await taskService.createTask(result.data);
    return successResponse(task, 'Task created successfully', undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
