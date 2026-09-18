import { NextRequest, NextResponse } from 'next/server';
import { getCachedCourseSchedule } from '../usi-api';
import { getVtimezoneComponent } from '@touch4it/ical-timezones';
import ical, { ICalEventData } from 'ical-generator';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const coursesParam = searchParams.get('courses');

  if (!coursesParam) {
    return NextResponse.json('Missing courses', { status: 400 });
  }
  const calendar = ical({ name: 'USI Courses Schedule' });
  calendar.timezone({
    name: 'Europe/Zurich',
    generator: getVtimezoneComponent,
  });

  const courseIds = coursesParam
    .split(',')
    .map((courseId) => parseInt(courseId, 10));

  try {
    await Promise.all(
      courseIds.map(async (courseId) => {
        const courseSchedules = await getCachedCourseSchedule(courseId);
        courseSchedules.forEach((schedule) => {
          const event: ICalEventData = {
            summary: schedule.course.name_en || schedule.course.name_it,
            start: new Date(schedule.start),
            end: new Date(schedule.end),
            timezone: 'Europe/Zurich',
            location: {
              title: schedule.place.office,
              address: schedule.place.building.campus.name,
            },
          };
          calendar.createEvent(event);
        });
      })
    );

    const calendarData = calendar.toString();
    return new NextResponse(calendarData, {
      headers: {
        'Content-Type': 'text/calendar',
        'Content-Disposition': 'inline; filename="usi-courses.ics"',
        'Cache-Control': 's-maxage=21600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('[api/calendar] Failed to fetch course schedules', {
      courseIds,
      error,
    });
    return NextResponse.json(
      { error: 'Failed to fetch course schedules' },
      { status: 502 }
    );
  }
}
