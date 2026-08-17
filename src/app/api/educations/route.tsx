import { NextResponse } from 'next/server';
import { getCachedEducations } from '../usi-api';
import { formatEducations } from '@/lib/usi-data';

export async function GET() {
  try {
    const educations = await getCachedEducations();
    const formattedEducations = formatEducations(educations);

    return NextResponse.json(formattedEducations, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[api/educations] Failed to fetch educations', error);
    return NextResponse.json(
      { error: 'Failed to fetch educations' },
      { status: 502 }
    );
  }
}
