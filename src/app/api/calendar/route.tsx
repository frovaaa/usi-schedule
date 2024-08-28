import { NextRequest, NextResponse } from 'next/server';
import ical, { ICalEventData } from 'ical-generator';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const coursesParam = searchParams.get('courses');

  const calendar = ical({ name: 'Course Schedule' });

  // add a test event
  const event: ICalEventData = {
    start: new Date(),
    end: new Date(),
    summary: 'Test Event',
    description: 'This is a test event',
  };

  calendar.createEvent(event);

  // return the calendar as a response
  const response = new NextResponse(calendar.toString(), {
    headers: {
      'Content-Type': 'text/calendar',
      'Content-Disposition': 'inline; filename="course-schedule.ics"',
    },
  });

  return response;

  // return NextResponse.json({
  //   events: coursesParam ? coursesParam : 'No courses provided',
  // });
}
