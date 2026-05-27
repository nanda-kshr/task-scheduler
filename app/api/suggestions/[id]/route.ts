import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/config/db';
import { suggestionService } from '@/services/SuggestionService';
import { successResponse, errorResponse } from '@/utils/api';
import { rateLimiter } from '@/lib/rateLimit';

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    rateLimiter(ip, { max: 60 });

    await connectToDatabase();
    const suggestion = await suggestionService.applySuggestion(params.id);
    return successResponse(suggestion, 'AI Rescheduling suggestion applied successfully');
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
    const suggestion = await suggestionService.rejectSuggestion(params.id);
    return successResponse(suggestion, 'AI Rescheduling suggestion rejected');
  } catch (error) {
    return errorResponse(error);
  }
}
