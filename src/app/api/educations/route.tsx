import { NextRequest, NextResponse } from 'next/server';
import { getCachedEducations } from '../usi-api';
import { Education } from '@/interfaces/AppInterfaces';

export async function GET(req: NextRequest) {
  try {
    const educations = await getCachedEducations();
    const formattedEducations: Education[] = educations.map(
      (education: any) => ({
        id: education.id,
        name_en: education.name_en || education.name_it,
        type: {
          id: education.type.id,
          name_en: education.type.name_en || education.type.name_it,
        },
      })
    );

    return NextResponse.json(formattedEducations, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return NextResponse.json('Failed to fetch educations', { status: 500 });
  }
}
