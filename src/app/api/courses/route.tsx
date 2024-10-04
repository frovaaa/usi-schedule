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
    const formattedCourses: Course[] = courses
      .filter((course) => {
        const currentYearSubstring = new Date().getFullYear().toString();
        const currentMonth = new Date().getMonth() + 1; // Adding 1 to get the month from 1 to 12
        const isSpringSemester = currentMonth >= 2 && currentMonth <= 7; // Assuming spring semester is from February to July
        const isAutumnSemester = !isSpringSemester; // Assuming autumn semester is from August to January

        if (isSpringSemester) {
          // Filter in only the ones with the current year and SP (spring) as a substring
          return (
            course.semester_academic_year.includes(currentYearSubstring) &&
            course.semester_academic_year.includes('SP')
          );
        } else if (isAutumnSemester) {
          // Filter in only the ones with the next year and SA (autumn) as a substring
          const nextYearSubstring = (new Date().getFullYear() + 1).toString();
          return (
            course.semester_academic_year.includes(nextYearSubstring) &&
            course.semester_academic_year.includes('SA')
          );
        } else {
          // If the current month is not within the expected range, exclude the course
          return false;
        }
      })
      .map((course) => ({
        id: course.id,
        name_en: course.name_en || course.name_it,
        semester_academic_year: course.semester_academic_year,
      }));

    return NextResponse.json(formattedCourses, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json('Failed to fetch courses', { status: 500 });
  }
}
