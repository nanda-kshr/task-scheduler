import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/config/db';
import { focusSessionService } from '@/services/FocusSessionService';
import { RecordFocusSessionSchema } from '@/validators/focus.validator';
import { successResponse, errorResponse } from '@/utils/api';
import { rateLimiter } from '@/lib/rateLimit';
import { ValidationError } from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    rateLimiter(ip, { max: 90 });

    await connectToDatabase();
    const sessions = await focusSessionService.getRecentSessions();
    return successResponse(sessions, 'Recent focus sessions retrieved');
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    rateLimiter(ip, { max: 60 });

    await connectToDatabase();
    const body = await req.json();

    const result = RecordFocusSessionSchema.safeParse(body);
    if (!result.success) {
      throw new ValidationError('Validation failed', result.error.issues);
    }

    const session = await focusSessionService.recordSession(result.data);
    return successResponse(session, 'Focus session logged successfully', undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
