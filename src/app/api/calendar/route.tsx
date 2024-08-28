import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventsParam = searchParams.get('events');

  return NextResponse.json({
    events: eventsParam ? JSON.parse(eventsParam) : 'No events',
  });
}
