import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const coursesParam = searchParams.get('courses');

  return NextResponse.json({
    events: coursesParam ? coursesParam : 'No courses provided',
  });
}
