import { unstable_cache } from 'next/cache';

const fetchCourses = async (educationId: number) => {
  const response = await fetch(
    `https://search.usi.ch/api/educations/${educationId}/courses`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  const result = await response.json();
  return result?.data;
};

export const getCachedCourses = unstable_cache(fetchCourses, ['educationId'], {
  tags: ['courses'],
  revalidate: 60 * 60 * 24 * 30,
});

const fetchEducations = async () => {
  const response = await fetch('https://search.usi.ch/api/educations');
  if (!response.ok) {
    throw new Error('Failed to fetch educations');
  }
  const result = await response.json();
  return result;
};

export const getCachedEducations = unstable_cache(fetchEducations, [], {
  tags: ['educations'],
  revalidate: 60 * 60 * 24 * 30,
});

const fetchCourseSchedule = async (courseId: number) => {
  const response = await fetch(
    `https://search.usi.ch/api/courses/${courseId}/schedules`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch course schedule');
  }
  const result = await response.json();
  return result?.data;
};

export const getCachedCourseSchedule = unstable_cache(
  fetchCourseSchedule,
  ['courseId'],
  {
    tags: ['course-schedule'],
    revalidate: 60 * 60 * 6,
  }
);
