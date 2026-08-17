import { Course, Education } from '@/interfaces/AppInterfaces';

export const USI_API_BASE_URL = 'https://search.usi.ch/api';

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null;

const getName = (value: UnknownRecord) => {
  const englishName = value.name_en;
  const italianName = value.name_it;

  if (typeof englishName === 'string' && englishName.length > 0) {
    return englishName;
  }
  if (typeof italianName === 'string') {
    return italianName;
  }
  throw new TypeError('USI API item is missing a name');
};

export const formatEducations = (value: unknown): Education[] => {
  if (!Array.isArray(value)) {
    throw new TypeError('USI API educations response is not an array');
  }

  return value.map((education) => {
    if (
      !isRecord(education) ||
      typeof education.id !== 'number' ||
      !isRecord(education.type) ||
      typeof education.type.id !== 'number'
    ) {
      throw new TypeError('USI API returned an invalid education');
    }

    return {
      id: education.id,
      name_en: getName(education),
      type: {
        id: education.type.id,
        name_en: getName(education.type),
      },
    };
  });
};

export const formatCourses = (value: unknown): Course[] => {
  const courses = isRecord(value) && 'data' in value ? value.data : value;

  if (!Array.isArray(courses)) {
    throw new TypeError('USI API courses response is not an array');
  }

  return courses.map((course) => {
    if (
      !isRecord(course) ||
      typeof course.id !== 'number' ||
      typeof course.semester_academic_year !== 'string'
    ) {
      throw new TypeError('USI API returned an invalid course');
    }

    return {
      id: course.id,
      name_en: getName(course),
      semester_academic_year: course.semester_academic_year,
    };
  });
};
