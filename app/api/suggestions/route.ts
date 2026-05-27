import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/config/db';
import { suggestionService } from '@/services/SuggestionService';
import { successResponse, errorResponse } from '@/utils/api';
import { rateLimiter } from '@/lib/rateLimit';

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    rateLimiter(ip, { max: 60 });

    await connectToDatabase();
    const suggestions = await suggestionService.getPendingSuggestions();
    return successResponse(suggestions, 'AI reschedule suggestions retrieved');
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    rateLimiter(ip, { max: 30 });

    await connectToDatabase();
    await suggestionService.generateAISuggestions();
    const suggestions = await suggestionService.getPendingSuggestions();
    return successResponse(suggestions, 'AI rescheduling scan completed');
  } catch (error) {
    return errorResponse(error);
  }
}
