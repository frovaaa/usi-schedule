import { Course } from '@/interfaces/AppInterfaces';

export const _fetchCourses = async (educationId: number) => {
  const response = await fetch(
    `https://search.usi.ch/api/educations/${educationId}/courses`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  const result: any = await response.json();
  return result?.data.filter((course: Course) => course.name_en !== '');
};

export const _fetchEducations = async () => {
  const response = await fetch('https://search.usi.ch/api/educations');
  if (!response.ok) {
    throw new Error('Failed to fetch educations');
  }
  const result: any = await response.json();
  return result;
};
