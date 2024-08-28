import { NextRequest, NextResponse } from 'next/server';
import { getCachedCourseSchedule } from '../../usi-api';
import { CourseSchedule } from '@/interfaces/AppInterfaces';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get('courseId');

  if (!courseId) {
    return NextResponse.json('Missing courseId', { status: 400 });
  }

  try {
    const courseSchedules = await getCachedCourseSchedule(
      parseInt(courseId, 10)
    );
    const formattedCourseSchedules: CourseSchedule[] = courseSchedules.map(
      (schedule: any) => ({
        course_name: schedule.course.name_en || schedule.course.name_it,
        start_date: schedule.start,
        end_date: schedule.end,
        location: {
          campus: schedule.place.building.campus,
          classroom: schedule.place.office,
        },
      })
    );

    return NextResponse.json(formattedCourseSchedules, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return NextResponse.json('Failed to fetch course schedules', {
      status: 500,
    });
  }
}
