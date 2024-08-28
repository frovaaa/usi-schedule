import { NextRequest, NextResponse } from 'next/server';
import { getCachedCourses } from '../usi-api';
import { Course } from '@/interfaces/AppInterfaces';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const educationId = searchParams.get('educationId');

  if (!educationId) {
    return NextResponse.json('Missing educationId', { status: 400 });
  }

  try {
    const courses = await getCachedCourses(parseInt(educationId, 10));
    const formattedCourses: Course[] = courses.map((course: any) => ({
      id: course.id,
      name_en: course.name_en || course.name_it,
      semester_academic_year: course.semester_academic_year,
    }));

    return NextResponse.json(formattedCourses, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return NextResponse.json('Failed to fetch courses', { status: 500 });
  }
}
