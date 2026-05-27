import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/config/db';
import { activityService } from '@/services/ActivityService';
import { successResponse, errorResponse } from '@/utils/api';
import { rateLimiter } from '@/lib/rateLimit';

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    rateLimiter(ip, { max: 90 });

    await connectToDatabase();
    const activities = await activityService.getRecentActivities();
    return successResponse(activities, 'Recent activities retrieved successfully');
  } catch (error) {
    return errorResponse(error);
  }
}
