import { NextRequest, NextResponse } from 'next/server';
import { getCachedCourseSchedule } from '../usi-api';
import { CourseSchedule } from '@/interfaces/AppInterfaces';
import ical, { ICalEventData } from 'ical-generator';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const coursesParam = searchParams.get('courses');

  if (!coursesParam) {
    return NextResponse.json('Missing courses', { status: 400 });
  }
  const calendar = ical({ name: 'USI Courses Schedule' });

  const courseIds = coursesParam
    .split(',')
    .map((courseId) => parseInt(courseId, 10));

  courseIds.forEach(async (courseId) => {
    try {
      const courseSchedules = await getCachedCourseSchedule(courseId);
      courseSchedules.forEach((schedule: CourseSchedule) => {
        const event: ICalEventData = {
          start: new Date(schedule.start_date),
          end: new Date(schedule.end_date),
          location: {
            title: schedule.location.campus,
            address: schedule.location.classroom,
          },
        };
        calendar.createEvent(event);
      });
    } catch (error) {
      return NextResponse.json('Failed to fetch course schedules', {
        status: 500,
      });
    }
  });
}
