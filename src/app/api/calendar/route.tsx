import { NextRequest, NextResponse } from 'next/server';
import { getCachedCourseSchedule } from '../usi-api';
import { EUROPE_ZURICH_TIMEZONE, getVtimezoneComponent } from '@/lib/timezones';
import ical, { ICalEventData } from 'ical-generator';
import { DateTime } from 'luxon';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const coursesParam = searchParams.get('courses');

  if (!coursesParam) {
    return NextResponse.json('Missing courses', { status: 400 });
  }
  const calendar = ical({ name: 'USI Courses Schedule' });
  // Leave the calendar timezone unset so DTSTAMP remains UTC. Each event
  // carries its own TZID, which also tells the generator which VTIMEZONE to add.
  calendar.timezone({
    name: '',
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
            start: DateTime.fromISO(schedule.start, { setZone: true }).setZone(
              EUROPE_ZURICH_TIMEZONE
            ),
            end: DateTime.fromISO(schedule.end, { setZone: true }).setZone(
              EUROPE_ZURICH_TIMEZONE
            ),
            timezone: EUROPE_ZURICH_TIMEZONE,
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
