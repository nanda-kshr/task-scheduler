import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/config/db';
import { statsService } from '@/services/StatsService';
import { successResponse, errorResponse } from '@/utils/api';
import { rateLimiter } from '@/lib/rateLimit';

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    rateLimiter(ip, { max: 90 });

    await connectToDatabase();
    const stats = await statsService.getDashboardStats();
    return successResponse(stats, 'Productivity stats computed successfully');
  } catch (error) {
    return errorResponse(error);
  }
}
