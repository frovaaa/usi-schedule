import { NextRequest, NextResponse } from 'next/server';
import { getCachedCourses } from '../usi-api';
import { formatCourses } from '@/lib/usi-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const educationId = searchParams.get('educationId');

  const parsedEducationId = Number(educationId);
  if (!Number.isInteger(parsedEducationId) || parsedEducationId <= 0) {
    return NextResponse.json('Missing educationId', { status: 400 });
  }

  try {
    const courses = await getCachedCourses(parsedEducationId);
    const formattedCourses = formatCourses(courses);

    return NextResponse.json(formattedCourses, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[api/courses] Failed to fetch courses', {
      educationId: parsedEducationId,
      error,
    });
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 502 }
    );
  }
}
